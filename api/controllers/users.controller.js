import User from '../models/user.model.js';
import Restaurant from '../models/restaurant.model.js';

import config from '../utils/env.js';
import transporter from '../utils/mail.js';

import createError from 'http-errors';
import jwt from 'jsonwebtoken';

export default {
  createUser: async function (req, res, next) {
    const { name, address, firstName, lastName, email, password } = req.body;
    if (!(firstName && lastName && email && password)) {
      return next(
        createError(
          400,
          'Request body is missing firstName, lastName, email, or password.'
        )
      );
    }

    let user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    });
    try {
      // If the request headers contain a token, this request is being made to
      // create a user that is accepting an email invitation for a role at a restaurant.
      // In this case, the user should be automatically verified and updated.
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, config.gmail.secret, async function (err, decoded) {
          if (err) {
            return next(createError(403, 'Failed to verify token.'));
          }
          user.verified = true;
          user.restaurants = [
            {
              restaurantId: decoded.restaurantId,
              role: 'manager',
            },
          ];
          let restaurant = await Restaurant.findOne({
            _id: decoded.restaurantId,
          }).exec();
          if (!restaurant) {
            return next(createError(404, 'Restaurant not found.'));
          }
          restaurant.users.push({
            userId: user._id,
            role: 'manager',
          });
          await user.save();
          await restaurant.save();

          return res.status(200).json('User created. Invitation accepted.');
        });
      }
      await user.save();
    } catch (error) {
      // Duplicate key error
      if (error.code === 11000) {
        // If the user already exists but the name and address fields are present,
        // this function is being used as middleware to create a restaurant.
        // Then if the user is verified, ignore the duplicate key error and continue.
        if (name && address) {
          const existingUser = await User.findOne({ email: email }).exec();
          if (!existingUser.verified) {
            return next(createError(403, 'Email not verified.'));
          }
          req.body.owner = { _id: existingUser._id };
          return next();
        }
        return next(createError(409, 'Email already exists.'));
      }
      return next(createError(500, error));
    }

    jwt.sign(
      { _id: user._id },
      config.gmail.secret,
      { expiresIn: '1d' },
      function (err, token) {
        if (err) {
          return next(createError(500, err));
        }
        const url = `http://localhost:5173/temp/verification?token=${token}`;
        transporter.sendMail(
          {
            to: email,
            subject: 'Verify your 86it account',
            html: `Please <a href="${url}">click here</a> to verify your email.`,
          },
          async function (err, info) {
            if (err) {
              return next(createError(500, err));
            }
            // If the name and address fields are present, this function is being
            // used as middleware to create a restaurant. Call next() to continue.
            if (name && address) {
              req.body.owner = { _id: user._id };
              return next();
            }
            res.status(200).json(`Verification email sent.`);
          }
        );
      }
    );
  },
};
