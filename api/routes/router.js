import usersRouter from './users.route.js';
import authRouter from './auth.route.js';
import restaurantsRouter from './restaurants.route.js';

export default function (app) {
  const prefix = '/api';
  app.use(`${prefix}/users`, usersRouter);
  app.use(`${prefix}/auth`, authRouter);
  app.use(`${prefix}/restaurants`, restaurantsRouter);
}
