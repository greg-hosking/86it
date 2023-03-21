import express from 'express';

const router = express.Router();

router.get('/', function (req, res, next) {
  res.json({ message: 'Hello from 86it!' });
});

export default router;
