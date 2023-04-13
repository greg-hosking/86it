import express from 'express';

import User from '../models/user.js';

import config from '../utils/env.js';
import requireAuth from '../middleware/auth.js';

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
router.post('/', async function (req, res, next) {
  // Validate request body.
  const { firstName, lastName, email, password } = req.body;
  if (!(firstName && lastName && email && password)) {
    return next(
      createError(
        400,
        'Request body is missing firstName, lastName, email, or password.'
      )
    );
  }

  // Create and save new user.
  const user = new User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
  });
  await user.save();

  // Sign token and send verification email asynchronously.
  jwt.sign(
    {
      id: user.id,
    },
    config.gmail.secret,
    {
      expiresIn: '1d',
    },
    function (err, token) {
      if (err) {
        return next(createError(500, 'Failed to sign token.'));
      }
      const url = `http://localhost:5173/temp/verification?token=${token}`;
      transporter.sendMail({
        to: email,
        subject: 'Verify email address for 86it',
        html: `Please <a href="${url}">click here</a> to verify your email.`,
      });
    }
  );
  res.status(201).json('User created.');
});

router.get('/', requireAuth, async function (req, res, next) {
  res.status(200).json(req.user.id);
});

export default router;
