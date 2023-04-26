import express from 'express';

import restaurantsRouter from './restaurants.route.js';
import sessionsRouter from './sessions.route.js';
import usersRouter from './users.route.js';

const router = express.Router();

router.use('/restaurants', restaurantsRouter);
router.use('/sessions', sessionsRouter);
router.use('/users', usersRouter);

export default router;
