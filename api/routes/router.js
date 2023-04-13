import usersRouter from './users.route.js';
import authRouter from './auth.route.js';

export default function (app) {
  const prefix = '/api';
  app.use(`${prefix}/users`, usersRouter);
  app.use(`${prefix}/auth`, authRouter);
}
