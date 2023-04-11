import helloRouter from './hello.js';
import helloDBRouter from './helloDB.js';
import usersRouter from './users.js';
import authRouter from './auth.js';

export default function (app) {
  const prefix = '/api';
  app.use(`${prefix}/hello`, helloRouter);
  app.use(`${prefix}/helloDB`, helloDBRouter);
  app.use(`${prefix}/users`, usersRouter);
  app.use(`${prefix}/auth`, authRouter);
}
