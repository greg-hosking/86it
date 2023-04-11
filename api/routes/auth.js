import express from 'express';
import mongodb from 'mongodb';

import User from '../models/user.js';

import config from '../utils/env.js';
import withDB from '../utils/db.js';

import bcrypt from 'bcrypt';
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
    return next(createError(401));
  }

  // Verify token.
  const token = authHeader.split(' ')[1];
  jwt.verify(token, config.gmail.secret, async function (err, decoded) {
    if (err) {
      return next(createError(403));
    }

    // Once token verified, update emailVerified in user.
    try {
      await User.findByIdAndUpdate(
        decoded.id,
        { emailVerified: true },
        { new: true }
      );
      return res.status(200).json('Email verified.');
    } catch (err) {
      return next(createError(500, err));
    }
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

  User.findOne({ email: email }, async function (err, user) {
    if (err) {
      return next(createError(500, err));
    }
    if (!user) {
      return next(createError(404));
    }
    if (!user.emailVerified) {
      return next(createError(403));
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return next(createError(401));
    }
    jwt.sign(
      {
        id: user._id,
      },
      config.gmail.secret,

      {
        expiresIn: '1d',
      },
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
});

/**
 *
 */
router.post('/recovery', async function (req, res, next) {
  const email = req.body.email;
  if (!email) {
    return next(createError(400, 'Request body is missing email.'));
  }

  await withDB(async function (db) {
    const users = db.collection('users');
    const user = users.findOne({ email: email });
    if (!user) {
      return next(createError(404));
    }

    // Send recovery email asynchronously.
    jwt.sign(
      {
        id: user._id,
      },
      config.gmail.secret,
      {
        expiresIn: '1d',
      },
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
  }, res);

  res.status(200).json({ message: 'Recovery email sent.' });
});

export default router;
