import express from 'express';

import restaurantsController from '../controllers/restaurants.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.post(
  '/users/me/restaurants',
  auth.isAuthenticated,
  restaurantsController.createRestaurant
);

router.get(
  '/users/me/restaurants',
  auth.isAuthenticated,
  restaurantsController.getAuthenticatedUserRestaurants
);

router.get('/restaurants/:restaurantId', restaurantsController.getRestaurant);

// Restaurant users
router.get(
  '/users/me/restaurants/:restaurantId/users',
  auth.isAuthenticated,
  restaurantsController.getRestaurantUsers
);

router.patch(
  '/users/me/restaurants/:restaurantId',
  auth.isAuthenticated,
  restaurantsController.acceptInvitation
);

router.delete(
  '/users/me/restaurants/:restaurantId',
  auth.isAuthenticated,
  restaurantsController.declineInvitation,
  restaurantsController.leaveRestaurant,
  restaurantsController.deleteRestaurant
);

router.post(
  '/users/me/restaurants/:restaurantId/users',
  auth.isAuthenticated,
  restaurantsController.inviteUserToRestaurant
);

router.patch(
  '/users/me/restaurants/:restaurantId/users/:userId',
  auth.isAuthenticated,
  restaurantsController.updateUserRole
);

router.delete(
  '/users/me/restaurants/:restaurantId/users/:userId',
  auth.isAuthenticated,
  restaurantsController.removeUserFromRestaurant
);

export default router;
