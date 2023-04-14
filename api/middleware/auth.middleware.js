import Restaurant from '../models/restaurant.model.js';

import config from '../utils/env.js';

import createError from 'http-errors';
import jwt from 'jsonwebtoken';

export default {
  isAuthenticated: async function (req, res, next) {
    const token = req.cookies['86it'];
    if (!token) {
      return next(createError(401, 'Request cookies are missing token.'));
    }

    jwt.verify(token, config.server.secret, function (err, decoded) {
      if (err) {
        return next(createError(403, 'Failed to verify token.'));
      }
      // Once verified, add the authenticated user to the request object so
      // that it can be used in the controller function that is called next.
      req.authenticatedUser = { _id: decoded._id };
      next();
    });
  },

  isRequestedUser: async function (req, res, next) {
    const { _id } = req.authenticatedUser;
    const { userId } = req.body;

    if (userId !== _id) {
      return next(createError(403, 'Unauthorized.'));
    }

    next();
  },

  isRestaurantOwner: async function (req, res, next) {
    const { restaurantId } = req.params;
    const { _id } = req.authenticatedUser;

    if (!restaurantId) {
      return next(createError(400, 'Request params is missing restaurantId.'));
    }

    const restaurant = await Restaurant.findOne({ _id: restaurantId }).exec();
    if (!restaurant) {
      return next(createError(404, 'Restaurant not found.'));
    }

    const user = restaurant.users.find((user) => user.userId === _id);
    if (!user || user.role !== 'owner') {
      return next(createError(403, 'Unauthorized.'));
    }

    next();
  },

  isRestaurantManager: async function (req, res, next) {
    const { restaurantId } = req.params;
    const { _id } = req.authenticatedUser;

    if (!restaurantId) {
      return next(createError(400, 'Request params is missing restaurantId.'));
    }

    const restaurant = await Restaurant.findOne({ _id: restaurantId }).exec();
    if (!restaurant) {
      return next(createError(404, 'Restaurant not found.'));
    }

    const user = restaurant.users.find((user) => user.userId === _id);
    if (!user || (user.role !== 'manager' && user.role !== 'owner')) {
      return next(createError(403, 'Unauthorized.'));
    }

    next();
  },
};
