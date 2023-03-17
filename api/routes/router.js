import helloRouter from './helloRouter.js';
import helloDBRouter from './helloDBRouter.js';

export default function (app) {
  const prefix = '/api';
  app.use(`${prefix}/hello`, helloRouter);
  app.use(`${prefix}/helloDB`, helloDBRouter);
}
