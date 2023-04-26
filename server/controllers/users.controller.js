import User from '../models/user.model.js';
import Restaurant from '../models/restaurant.model.js';

import config from '../utils/env.js';
import transporter from '../utils/mail.js';

import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

// ***********
// CREATE USER
// ***********
async function createUser(req, res, next) {
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
      const base =
        config.server.env === 'PRODUCTION' ? 'TODO' : 'http://localhost:3000';
      const url = `${base}/?token=${token}`;
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
          res.status(201).json('User created. Verification email sent.');
        }
      );
    }
  );
}

// ********************************
// UPDATE EMAIL VERIFIED WITH TOKEN
// ********************************
async function updateEmailVerifiedWithToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!(authHeader && authHeader.startsWith('Bearer '))) {
    return next(createError(401, 'Request headers are missing authorization.'));
  }

  const token = authHeader.split(' ')[1];
  console.log('token: ', token);
  jwt.verify(token, config.gmail.secret, async function (err, decoded) {
    if (err) {
      return next(createError(403, 'Failed to verify token.'));
    }
    const user = await User.findOne({ _id: decoded._id }).exec();
    if (!user) {
      return next(createError(404, 'User not found.'));
    }
    user.verified = true;
    await user.save();
    return res.status(200).json('Email verified.');
  });
}

// ************************
// GET PASSWORD RESET TOKEN
// ************************
async function getPasswordResetToken(req, res, next) {
  const { email } = req.query;
  if (!email) {
    return next(createError(400, 'Request query is missing email.'));
  }

  const user = await User.findOne({ email }).exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  if (!user.verified) {
    return next(createError(403, 'Email not verified.'));
  }

  jwt.sign(
    { _id: user._id },
    config.gmail.secret,
    { expiresIn: '1d' },
    function (err, token) {
      if (err) {
        return next(createError(500, err));
      }
      const base =
        config.server.env === 'PRODUCTION' ? 'TODO' : 'http://localhost:3000';
      const url = `${base}/reset-password?token=${token}`;
      transporter.sendMail(
        {
          to: email,
          subject: 'Reset your 86it password',
          html: `Please <a href="${url}">click here</a> to reset your password. 
          If you didn't request this, please ignore this email.`,
        },
        function (err, info) {
          if (err) {
            return next(createError(500, err));
          }
          res.status(200).json('Reset password email sent.');
        }
      );
    }
  );
}

// **************************
// UPDATE PASSWORD WITH TOKEN
// **************************
async function updatePasswordWithToken(req, res, next) {
  const { password } = req.body;
  if (!password) {
    return next(createError(400, 'Request body is missing password.'));
  }

  const authHeader = req.headers.authorization;
  if (!(authHeader && authHeader.startsWith('Bearer '))) {
    return next(createError(401, 'Request headers are missing authorization.'));
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, config.gmail.secret, async function (err, decoded) {
    if (err) {
      return next(createError(403, 'Failed to verify token.'));
    }
    const user = await User.findOne({ _id: decoded._id }).exec();
    if (!user) {
      return next(createError(404, 'User not found.'));
    }
    if (!user.verified) {
      return next(createError(403, 'Email not verified.'));
    }
    user.password = password;
    await user.save();
    return res.status(200).json('Password reset.');
  });
}

// **********************
// GET AUTHENTICATED USER
// **********************
async function getAuthenticatedUser(req, res, next) {
  const { _id } = req.authenticatedUser;
  const user = await User.findOne({ _id: _id }).exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  res.status(200).json(_.omit(user.toObject(), ['password']));
}

export default {
  createUser,
  updateEmailVerifiedWithToken,
  getPasswordResetToken,
  updatePasswordWithToken,
  getAuthenticatedUser,
};

// getUser: async function (req, res, next) {
//   const { userId } = req.params;
//   const user = await User.findOne({ _id: userId }).exec();
//   if (!user) {
//     return next(createError(404, 'User not found.'));
//   }
//   res.status(200).json(_.omit(user.toObject(), ['password', 'verified']));
// },

// updateUserImage: async function (req, res, next) {
//   const { userId } = req.params;
//   let user = await User.findOne({ _id: userId }).exec();
//   if (!user) {
//     return next(createError(404, 'User not found.'));
//   }
//   user.image = req.file.location;
//   await user.save();
//   res.status(200).json('User image updated.');
// },
