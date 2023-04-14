import User from '../models/user.model.js';
import Restaurant from '../models/restaurant.model.js';

import config from '../utils/env.js';
import transporter from '../utils/mail.js';

import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

export default {
  getUser: async function (req, res, next) {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId }).exec();
    if (!user) {
      return next(createError(404, 'User not found.'));
    }
    res.status(200).json(_.omit(user.toObject(), ['password', 'verified']));
  },

  getUserRestaurants: async function (req, res, next) {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId }).exec();
    if (!user) {
      return next(createError(404, 'User not found.'));
    }

    let restaurants = [];
    for await (const restaurant of user.restaurants) {
      const r = await Restaurant.findOne({
        _id: restaurant.restaurantId,
      }).exec();
      restaurants.push({
        name: r.name,
        _id: restaurant.restaurantId,
        role: restaurant.role,
      });
    }
    res.status(200).json(restaurants);
  },

  createUser: async function (req, res, next) {
    const { firstName, lastName, email, password } = req.body;
    if (!(firstName && lastName && email && password)) {
      return next(
        createError(
          400,
          'Request body is missing firstName, lastName, email, or password.'
        )
      );
    }

    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    });

    try {
      await user.save();
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        return next(createError(409, 'User already exists with that email.'));
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
            res.status(200).json(`Verification email sent.`);
          }
        );
      }
    );
  },

  updateUserImage: async function (req, res, next) {
    const { userId } = req.params;
    let user = await User.findOne({ _id: userId }).exec();
    if (!user) {
      return next(createError(404, 'User not found.'));
    }
    user.image = req.file.location;
    await user.save();
    res.status(200).json('User image updated.');
  },
};

// This snippet of code aims to create a user that is accepting an email invitation
// for a role at a restaurant. I am considering a different approach that would
// require the user to create an account and then accept the invitation from the
// invitation inbox or something like that.

// // If the request headers contain a token, this request is being made to
// // create a user that is accepting an email invitation for a role at a restaurant.
// // In this case, the user should be automatically verified and updated.
// const authHeader = req.headers.authorization;
// if (authHeader && authHeader.startsWith('Bearer ')) {
//   const token = authHeader.split(' ')[1];
//   jwt.verify(token, config.gmail.secret, async function (err, decoded) {
//     if (err) {
//       return next(createError(403, 'Failed to verify token.'));
//     }
//     user.verified = true;
//     user.restaurants = [
//       {
//         restaurantId: decoded.restaurantId,
//         role: 'manager',
//       },
//     ];
//     let restaurant = await Restaurant.findOne({
//       _id: decoded.restaurantId,
//     }).exec();
//     if (!restaurant) {
//       return next(createError(404, 'Restaurant not found.'));
//     }
//     restaurant.users.push({
//       userId: user._id,
//       role: 'manager',
//     });
//     await user.save();
//     await restaurant.save();

//     return res.status(200).json('User created. Invitation accepted.');
//   });
// }
