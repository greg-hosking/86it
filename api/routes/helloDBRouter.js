import express from 'express';
import withDB from '../db.js';
const helloDBRouter = express.Router();

helloDBRouter.get('/', async function (req, res, next) {
  const collectionNames = await withDB(async function (db) {
    const collections = await db.listCollections().toArray();
    return collections.map((col) => {
      return col.name;
    });
  }, res);
  res.json({ collections: collectionNames });
});

export default helloDBRouter;
