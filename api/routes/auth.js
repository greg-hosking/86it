import express from 'express';
import mongodb from 'mongodb';

import config from '../utils/env.js';
import withDB from '../utils/db.js';

import bcrypt from 'bcrypt';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';

const router = express.Router();

/**
 *
 */
router.get('/verification', async function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, config.gmail.secret, async function (err, user) {
      if (err) {
        return next(createError(403));
      }
      // Once token verified, update emailVerified in user.
      const result = await withDB(async function (db) {
        const users = db.collection('users');
        const ObjectId = mongodb.ObjectId;
        return await users.updateOne(
          { _id: new ObjectId(user.id) },
          { $set: { emailVerified: true } }
        );
      }, res);
      if (!result) {
        return next(createError(500));
      }

      return res
        .status(200)
        .json({ message: `Successfully verified email for user ${user.id}` });
    });
  } else {
    return next(createError(401));
  }
});

/**
 *
 */
router.post('/', async function (req, res, next) {
  const { email, password } = req.body;
  if (!(email && password)) {
    return next(createError(400, 'Request body is missing email or password.'));
  }

  await withDB(async function (db) {
    const users = db.collection('users');
    const user = await users.findOne({ email: email });
    if (!user) {
      // TODO: Add error description
      return next(createError(404));
    }

    if (!user.emailVerified) {
      // TODO: Add error description
      return next(createError(403));
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // TODO: Add error description
      return next(createError(401));
    }

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
          return next(createError(500, err));
        }

        return res
          .status(200)
          .clearCookie('86itCookie')
          .cookie('86itCookie', token, { httpOnly: true })
          .send();
      }
    );
  }, res);
});

export default router;
