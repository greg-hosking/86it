import express from 'express';

import restaurantsController from '../controllers/restaurants.controller.js';

import auth from '../middleware/auth.middleware.js';

import upload from '../utils/upload.js';

const router = express.Router();

router.get('/', auth.isAuthenticated, restaurantsController.getRestaurants);

router.get(
  '/:restaurantId',
  auth.isAuthenticated,
  restaurantsController.getRestaurantById
);

router.post('/', auth.isAuthenticated, restaurantsController.createRestaurant);

router.put(
  '/:restaurantId',
  auth.isAuthenticated,
  auth.isRestaurantManager,
  restaurantsController.updateRestaurant
);

router.put(
  '/:restaurantId/image',
  auth.isAuthenticated,
  auth.isRestaurantManager,
  upload.single('image'),
  restaurantsController.updateRestaurantImage
);

router.post(
  '/:restaurantId/users',
  auth.isAuthenticated,
  auth.isRestaurantManager,
  restaurantsController.inviteUserToRestaurant
);

router.post(
  '/:restaurantId/users/:userId/accept',
  auth.isAuthenticated,
  auth.isRequestedUser,
  restaurantsController.acceptInvitation
);

router.post(
  '/:restaurantId/users/:userId/reject',
  auth.isAuthenticated,
  auth.isRequestedUser,
  restaurantsController.rejectInvitation
);

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
