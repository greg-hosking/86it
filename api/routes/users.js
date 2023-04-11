import express from 'express';

import requireAuth from '../middleware/auth.js';
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

router.post('/', async function (req, res, next) {
  const { firstName, lastName, email, password } = req.body;
  if (!(firstName && lastName && email && password)) {
    return next(
      createError(
        400,
        'Request body is missing one of the following fields: ' +
          'firstName, lastName, email, or password.'
      )
    );
  }

  // Hash provided plaintext password.
  const rounds = 10;
  const hash = await bcrypt.hash(password, rounds);

  const newUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    emailVerified: false,
    password: hash,
    roles: [],
    favorite_items: [],
  };

  const insertedUser = await withDB(async function (db) {
    const users = db.collection('users');
    const existingUser = await users.findOne({ email: email });
    if (existingUser) {
      return next(
        createError(400, 'User already exists with the given email.')
      );
    }
    return await users.insertOne(newUser);
  }, res);

  if (!insertedUser) return;
  const id = insertedUser.insertedId;

  // Send verification email asynchronously.
  jwt.sign(
    {
      id: id,
    },
    config.gmail.secret,
    {
      expiresIn: '1d',
    },
    function (err, token) {
      if (err) {
        return next(createError(500));
      }
      const url = `http://localhost:5173/temp/verification?token=${token}`;

      transporter.sendMail({
        to: email,
        subject: 'Verify email address for 86it',
        html: `Please <a href="${url}">click here</a> to verify your email.`,
      });
    }
  );

  res.status(201).json({ id: id });
});

router.get('/', requireAuth, async function (req, res, next) {
  res.status(200).json(req.user.id);
});

export default router;
