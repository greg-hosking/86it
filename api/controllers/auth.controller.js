import User from '../models/user.model.js';

import config from '../utils/env.js';
import transporter from '../utils/mail.js';

import createError from 'http-errors';
import jwt from 'jsonwebtoken';

export async function verifyEmail(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!(authHeader && authHeader.startsWith('Bearer '))) {
    return next(createError(401, 'Request headers are missing authorization.'));
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, config.gmail.secret, async function (err, decoded) {
    if (err) {
      return next(createError(403, 'Failed to verify token.'));
    }
    const user = await User.findOne({ _id: decoded.id }).exec();
    if (!user) {
      return next(createError(404, 'User not found.'));
    }
    user.emailVerified = true;
    await user.save();
  });

  return res.status(200).json('Email verified.');
}

export async function sendResetPasswordEmail(req, res, next) {
  const { email } = req.body;
  if (!email) {
    return next(createError(400, 'Request body is missing email.'));
  }

  const user = await User.findOne({ email: email }).exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  if (!user.emailVerified) {
    return next(createError(403, 'Email not verified.'));
  }

  jwt.sign(
    { id: user._id },
    config.gmail.secret,
    { expiresIn: '1d' },
    function (err, token) {
      if (err) {
        return next(createError(500, err));
      }
      const url = `http://localhost:5173/temp/reset-password?token=${token}`;
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
          res
            .status(200)
            .json({ message: `Reset password email sent. ${info.response}` });
        }
      );
    }
  );
}

export async function resetPassword(req, res, next) {
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
    const user = await User.findOne({ _id: decoded.id }).exec();
    if (!user) {
      return next(createError(404, 'User not found.'));
    }
    if (!user.emailVerified) {
      return next(createError(403, 'Email not verified.'));
    }
    user.password = password;
    await user.save();
  });

  return res.status(200).json('Password reset.');
}

export async function signIn(req, res, next) {
  const { email, password } = req.body;
  if (!(email && password)) {
    return next(createError(400, 'Request body is missing email or password.'));
  }

  const user = await User.findOne({ email: email }).exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  if (!user.emailVerified) {
    return next(createError(403, 'Email not verified.'));
  }

  const match = await user.comparePassword(password);
  if (!match) {
    return next(createError(401, 'Incorrect password.'));
  }

  jwt.sign(
    { id: user._id },
    config.gmail.secret,
    { expiresIn: '1d' },
    function (err, token) {
      if (err) {
        return next(createError(500, err));
      }
      return res
        .status(200)
        .clearCookie('86it')
        .cookie('86it', token, { httpOnly: true })
        .json('Signed in. Cookie set.');
    }
  );
}
