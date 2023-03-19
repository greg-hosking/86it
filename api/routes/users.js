import express from 'express';
import config from '../utils/env.js';
import nodemailer from 'nodemailer';
import createError from 'http-errors';
import withDB from '../utils/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  auth: {
    user: config.gmail.user,
    pass: config.gmail.pass,
  },
});

router.post('/', async function (req, res, next) {
  if (
    !(
      req.body.firstName &&
      req.body.lastName &&
      req.body.email &&
      req.body.password
    )
  ) {
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
  const hash = await bcrypt.hash(req.body.password, rounds);

  const newUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    emailVerified: false,
    password: hash,
    roles: [],
    favorite_items: [],
  };

  const insertResult = await withDB(async function (db) {
    const users = db.collection('users');
    const findResult = await users.findOne({ email: newUser.email });
    if (findResult) {
      return next(
        createError(400, 'User already exists with the given email.')
      );
    }
    return await users.insertOne(newUser);
  }, res);

  if (!insertResult) return;

  // Send verification email asynchronously.
  jwt.sign(
    {
      userId: insertResult.insertedId,
    },
    process.env.EMAIL_SECRET,
    {
      expiresIn: '1d',
    },
    function (err, token) {
      const url = `http://localhost:3001/verification/${token}`;

      transporter.sendMail({
        to: newUser.email,
        subject: 'Verify email address for 86it',
        html: `Please <a href="${url}">click here</a> to verify your email.`,
      });
    }
  );
});

export default router;
