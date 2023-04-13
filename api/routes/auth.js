import express from 'express';

import User from '../models/user.js';

import config from '../utils/env.js';

import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: config.gmail.host,
  auth: {
    user: config.gmail.user,
    pass: config.gmail.pass,
  },
});

/**
 *
 */
router.get('/verification', async function (req, res, next) {
  // Validate request headers.
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(createError(401, 'Request headers are missing authorization.'));
  }

  // Verify token.
  const token = authHeader.split(' ')[1];
  jwt.verify(token, config.gmail.secret, async function (err, decoded) {
    if (err) {
      return next(createError(403, 'Failed to verify token.'));
    }

    // Once token verified, update emailVerified in user.
    const user = await User.findOne({ _id: decoded.id }).exec();
    if (!user) {
      return next(createError(404, 'User not found.'));
    }

    user.emailVerified = true;
    await user.save();

    return res.status(200).json('Email verified.');
  });
});

/**
 *
 */
router.post('/forgot-password', async function (req, res, next) {
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

  // Send recovery email asynchronously.
  jwt.sign(
    { id: user._id },
    config.gmail.secret,
    { expiresIn: '1d' },
    function (err, token) {
      if (err) {
        return next(createError(500, err));
      }
      const url = `http://localhost:5173/temp/reset-password?token=${token}`;

      transporter.sendMail({
        to: email,
        subject: 'Recover your 86it password',
        html: `Please <a href="${url}">click here</a> to recover your password. 
               If you didn't request this, please ignore this email.`,
      });
    }
  );

  res.status(200).json({ message: 'Recovery email sent.' });
});

/**
 *
 */
router.post('/reset-password', async function (req, res, next) {
  // Validate request body.
  const { password } = req.body;
  if (!password) {
    return next(createError(400, 'Request body is missing password.'));
  }

  // Validate request headers.
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(createError(401, 'Request headers are missing authorization.'));
  }

  // Verify token.
  const token = authHeader.split(' ')[1];
  jwt.verify(token, config.gmail.secret, async function (err, decoded) {
    if (err) {
      return next(createError(403, 'Failed to verify token.'));
    }

    // Once token verified, update user password.
    const user = await User.findOne({ _id: decoded.id }).exec();
    if (!user) {
      return next(createError(404, 'User not found.'));
    }
    if (!user.emailVerified) {
      return next(createError(403, 'Email not verified.'));
    }

    user.password = password;
    await user.save();

    return res.status(200).json('Password reset.');
  });
});

/**
 *
 */
router.post('/', async function (req, res, next) {
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
        .clearCookie('86itCookie')
        .cookie('86itCookie', token, { httpOnly: true })
        .send();
    }
  );
});

export default router;
