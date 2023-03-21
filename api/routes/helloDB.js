import express from 'express';

import withDB from '../utils/db.js';

const router = express.Router();

router.get('/', async function (req, res, next) {
  const names = await withDB(async function (db) {
    const collections = await db.listCollections().toArray();
    return collections.map((col) => {
      return col.name;
    });
  }, res);

  res.json({ collections: names });
});

export default router;
