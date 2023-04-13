import User from '../models/user.model.js';

import config from '../utils/env.js';
import transporter from '../utils/mail.js';

import createError from 'http-errors';
import jwt from 'jsonwebtoken';

export async function createUser(req, res, next) {
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
  await user.save();

  jwt.sign(
    { id: user.id },
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
          html: `Please <a href="${url}">click here</a> to verify your email. 
             If you didn't request this, please ignore this email.`,
        },
        function (err, info) {
          if (err) {
            return next(createError(500, err));
          }
          res.status(200).json(`Verification email sent. ${info.response}`);
        }
      );
    }
  );
}
