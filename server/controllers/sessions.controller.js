import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import User from '../models/user.model.js';
import config from '../utils/env.js';

// *******
// SIGN IN
// *******
async function signIn(req, res, next) {
  const { email, password } = req.body;
  if (!(email && password)) {
    return next(createError(400, 'Request body is missing email or password.'));
  }

  const user = await User.findOne({ email: email }).exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  if (!user.verified) {
    return next(createError(403, 'Email not verified.'));
  }
  const match = await user.comparePassword(password);
  if (!match) {
    return next(createError(401, 'Incorrect password.'));
  }

  jwt.sign(
    { _id: user._id },
    config.server.secret,
    { expiresIn: '1d' },
    function (err, token) {
      if (err) {
        return next(createError(500, err));
      }
      return res
        .status(200)
        .cookie('86it', token, { httpOnly: true })
        .json(_.omit(user.toObject(), ['password']));
    }
  );
}

// ********
// SIGN OUT
// ********
async function signOut(req, res, next) {
  return res.status(200).clearCookie('86it').end();
}

export default {
  signIn,
  signOut,
};
