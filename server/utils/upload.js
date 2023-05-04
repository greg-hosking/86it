import multer from 'multer';
import multerS3 from 'multer-s3';

import config from './env.js';
import s3 from './s3.js';

import createError from 'http-errors';
import path from 'path';

export default multer({
  storage: multerS3({
    s3: s3,
    bucket: config.aws.bucket,
    key: async function (req, file, cb) {
      const userId = req.authenticatedUser._id;
      const { restaurantId, itemId } = req.params;
      const ext = path.extname(file.originalname);

      if (userId && !restaurantId && !itemId) {
        // Remove old avatar from S3
        await s3
          .deleteObjects({
            Bucket: config.aws.bucket,
            Delete: {
              Objects: [
                { Key: `users/${userId}/avatar.jpg` },
                { Key: `users/${userId}/avatar.jpeg` },
                { Key: `users/${userId}/avatar.png` },
                { Key: `users/${userId}/avatar.webp` },
                { Key: `users/${userId}/avatar.gif` },
              ],
            },
          })
          .promise();
        // Upload new avatar to S3
        cb(null, `users/${userId}/avatar${ext}`);
      }
      // TODO: Handle restaurant-related uploads
    },
  }),
  limits: { fileSize: 8000000 }, // In bytes: 8000000 bytes = 8 MB
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/.(jpg|jpeg|png|webp|gif)$/gm)) {
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
