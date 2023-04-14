import express from 'express';

import usersController from '../controllers/users.controller.js';

import auth from '../middleware/auth.middleware.js';

import upload from '../utils/upload.js';

const router = express.Router();

router.post('/', usersController.createUser);

router.get(
  '/:userId',
  auth.isAuthenticated,
  // auth.isRequestedUser,
  usersController.getUser
);

router.patch(
  '/:userId',
  auth.isAuthenticated,
  auth.isRequestedUser,
  upload.single('image'),
  usersController.updateUserImage
);

router.get(
  '/:userId/restaurants',
  auth.isAuthenticated,
  auth.isRequestedUser,
  usersController.getUserRestaurants
);

export default router;
