import express from 'express';

import menusController from '../controllers/menus.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

// ROUTES:
// GET /menus
// POST /menus
// GET /menus/:id
// PUT /menus/:id
// DELETE /menus/:id

router.post(
  '/',
  // async function (req, res, next) {
  //   const { restaurantId } = req.params;
  //   console.log('restaurantId', restaurantId);
  //   req.restaurantId = restaurantId;
  //   next();
  // },
  auth.isAuthenticated,
  menusController.createMenu
);

router.get(
  '/',
  // async function (req, res, next) {
  //   const { restaurantId } = req.params;
  //   console.log('restaurantId', restaurantId);
  //   req.restaurantId = restaurantId;
  //   next();
  // },
  auth.isAuthenticated,
  menusController.getMenus
);

router.get('/:menuId', auth.isAuthenticated, menusController.getMenu);

export default router;
