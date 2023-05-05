import express from 'express';

import menusRouter from './menus.route.js';
import restaurantsRouter from './restaurants.route.js';
import sessionsRouter from './sessions.route.js';
import usersRouter from './users.route.js';

const router = express.Router();

router.use('/', restaurantsRouter);
router.use('/sessions', sessionsRouter);
router.use('/users', usersRouter);
router.use(
  '/users/me/restaurants/:restaurantId/menus',
  async function (req, res, next) {
    const { restaurantId } = req.params;
    req.restaurantId = restaurantId;
    next();
  },
  menusRouter
);

export default router;
