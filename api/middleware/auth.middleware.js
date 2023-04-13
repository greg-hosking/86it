import config from '../utils/env.js';

import createError from 'http-errors';
import jwt from 'jsonwebtoken';

export default async function (req, res, next) {
  const token = req.cookies['86it'];
  if (!token) {
    return next(createError(401));
  }

  jwt.verify(token, config.gmail.secret, function (err, decoded) {
    if (err) {
      return next(createError(403));
    }
    req.user = { id: decoded.id };
    next();
  });
}
