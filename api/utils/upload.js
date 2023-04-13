import aws from 'aws-sdk';

import config from '../utils/env.js';

import createError from 'http-errors';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';

aws.config.update(
  {
    secretAccessKey: config.aws.secretAccessKey,
    accessKeyId: config.aws.accessKeyId,
    region: config.aws.region,
  },
  function (err) {
    if (err) {
      console.log(err);
    }
  }
);

const s3 = new aws.S3();

export default multer({
  storage: multerS3({
    s3: s3,
    bucket: config.aws.bucket,
    key: function (req, file, cb) {
      const { userId, restaurantId, itemId } = req.params;
      const ext = path.extname(file.originalname);
      if (userId) {
        cb(null, `users/${userId}/portrait${ext}`);
      } else if (restaurantId && !itemId) {
        cb(null, `restaurants/${restaurantId}/logo${ext}`);
      } else if (restaurantId && itemId) {
        cb(
          null,
          // TODO: Figure out how to manage multiple files for an item.
          `restaurants/${restaurantId}/items/${itemId}/${file.originalname}`
        );
      } else {
        cb(new Error('Invalid upload path.'));
      }
    },
  }),
  limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/.(jpg|jpeg|png|webp)$/gm)) {
      return cb(
        createError(
          400,
          'Please upload an image with jpg, jpeg, png, or webp format.'
        )
      );
    }
    cb(undefined, true);
  },
});
