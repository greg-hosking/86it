import express from 'express';

import upload from '../utils/upload.js';

const router = express.Router();

// TODO: Add routes for restaurants...

// Example route for uploading an image
router.post(
  '/:restaurantId/items/:itemId/',
  upload.single('image'),
  function (req, res, next) {
    res.status(200).json({
      message: 'Successfully uploaded image',
      url: req.file.location,
    });
  }
);

export default router;
