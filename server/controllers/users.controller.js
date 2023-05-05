import User from '../models/user.model.js';

import config from '../utils/env.js';
import s3 from '../utils/s3.js';
import transporter from '../utils/mail.js';

import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

// *******
// SIGN UP
// *******
async function signUp(req, res, next) {
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
    // Duplicate key error
    if (error.code === 11000) {
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
        config.server.env === 'production'
          ? 'https://eightysixit.herokuapp.com/'
          : 'http://localhost:3000';
      const url = `${base}/?token=${token}`;
      transporter.sendMail(
        {
          to: email,
          subject: '86it - Verify your email',
          html: `Hi ${user.firstName},<br><br>
            We just need to verify your email before you can start using 86it.<br><br>
            Please <a href="${url}">click here</a> to verify your email.<br><br>
            Thanks! - The 86it team`,
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

// **********************
// GET AUTHENTICATED USER
// **********************
async function getAuthenticatedUser(req, res, next) {
  const { _id } = req.authenticatedUser;
  const user = await User.findOne({ _id: _id }).select('-password').exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  res.status(200).json(user);
}

// *************************
// UPDATE AUTHENTICATED USER
// *************************
async function updateAuthenticatedUser(req, res, next) {
  const { _id } = req.authenticatedUser;
  const user = await User.findOne({ _id: _id }).exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  const { firstName, lastName, oldPassword, newPassword } = req.body;
  if (firstName) {
    user.firstName = firstName;
  }
  if (lastName) {
    user.lastName = lastName;
  }
  if (oldPassword && newPassword) {
    const match = await user.comparePassword(oldPassword);
    if (!match) {
      return next(createError(401, 'Incorrect password.'));
    }
    user.password = newPassword;
  }
  await user.save();
  res.status(204).json(_.omit(user.toObject(), ['password']));
}

// ********************************
// UPDATE AUTHENTICATED USER AVATAR
// ********************************
async function updateAuthenticatedUserAvatar(req, res, next) {
  const { _id } = req.authenticatedUser;
  const user = await User.findOne({ _id: _id }).select('-password').exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  user.avatar = req.file.location;
  await user.save();
  res.status(204).json(user);
}

// ********************************
// DELETE AUTHENTICATED USER AVATAR
// ********************************
async function deleteAuthenticatedUserAvatar(req, res, next) {
  const { _id } = req.authenticatedUser;
  const user = await User.findOne({ _id: _id }).select('-password').exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  user.avatar = null;
  await s3
    .deleteObjects({
      Bucket: config.aws.bucket,
      Delete: {
        Objects: [
          { Key: `users/${_id}/avatar.jpg` },
          { Key: `users/${_id}/avatar.jpeg` },
          { Key: `users/${_id}/avatar.png` },
          { Key: `users/${_id}/avatar.webp` },
          { Key: `users/${_id}/avatar.gif` },
        ],
      },
    })
    .promise();
  await user.save();
  res.status(204).json(user);
}

// *************************
// DELETE AUTHENTICATED USER
// *************************
async function deleteAuthenticatedUser(req, res, next) {
  // TODO: Delete the user, all restaurants they own, and all roles they have.
  //       Also, when deleting a restaurant, delete everything related to it.
}

// ************
// VERIFY EMAIL
// ************
async function verifyEmail(req, res, next) {
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
    user.verified = true;
    await user.save();
    return res.status(200).json('Email verified.');
  });
}

// **********************
// REQUEST PASSWORD RESET
// **********************
async function requestPasswordReset(req, res, next) {
  const { email } = req.query;
  if (!email) {
    return next(createError(400, 'Request query is missing email.'));
  }

  const user = await User.findOne({ email: email }).exec();
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
        config.server.env === 'production'
          ? 'https://eightysixit.herokuapp.com'
          : 'http://localhost:3000';
      const url = `${base}/reset-password?token=${token}`;
      transporter.sendMail(
        {
          to: email,
          subject: '86it - Reset your password',
          html: `Hi ${user.firstName},<br><br>
            We received a request to reset the password for your 86it account.<br><br>
            To proceed with resetting your password, please <a href="${url}">click here</a>.<br><br>
            If you did not request a password reset, please ignore this email.<br><br>
            Thanks! - The 86it team`,
        },
        function (err, info) {
          if (err) {
            return next(createError(500, err));
          }
          res.status(200).json('Password reset email sent.');
        }
      );
    }
  );
}

// **************
// RESET PASSWORD
// **************
async function resetPassword(req, res, next) {
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

export default {
  signUp,
  getAuthenticatedUser,
  updateAuthenticatedUser,
  updateAuthenticatedUserAvatar,
  deleteAuthenticatedUserAvatar,
  deleteAuthenticatedUser,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
};
