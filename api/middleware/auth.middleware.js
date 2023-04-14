import config from '../utils/env.js';

import createError from 'http-errors';
import jwt from 'jsonwebtoken';

export default async function (req, res, next) {
  const token = req.cookies['86it'];
  if (!token) {
    return next(createError(401, 'Request cookies are missing token.'));
  }

  jwt.verify(token, config.server.secret, function (err, decoded) {
    if (err) {
      return next(createError(403, 'Failed to verify token.'));
    }
    req.user = { id: decoded.id };
    next();
  });
}
