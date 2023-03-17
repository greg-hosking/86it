import express from 'express';
const helloRouter = express.Router();

helloRouter.get('/', function (req, res, next) {
  res.json({ message: 'Hello, World!' });
});

export default helloRouter;
