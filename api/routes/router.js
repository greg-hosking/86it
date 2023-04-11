import usersRouter from './users.js';
import authRouter from './auth.js';

export default function (app) {
  const prefix = '/api';

  app.use(`${prefix}/users`, usersRouter);
  app.use(`${prefix}/auth`, authRouter);
}
