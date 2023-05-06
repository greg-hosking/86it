import express from 'express';

import menusController from '../controllers/menus.controller.js';
import auth from '../middleware/auth.middleware.js';

import upload from '../utils/upload.js';

const router = express.Router();

router.post('/', auth.isAuthenticated, menusController.createMenu);

router.get('/', auth.isAuthenticated, menusController.getMenus);

router.delete('/:menuId', auth.isAuthenticated, menusController.deleteMenu);

router.post(
  '/:menuId/sections',
  auth.isAuthenticated,
  menusController.createSection
);

router.delete(
  '/:menuId/sections/:sectionId',
  auth.isAuthenticated,
  menusController.deleteSection
);

router.get('/:menuId', auth.isAuthenticated, menusController.getMenu);

router.post(
  '/:menuId/sections/:sectionId/items',
  auth.isAuthenticated,
  menusController.createItem
);

router.delete(
  '/:menuId/sections/:sectionId/items/:itemId',
  auth.isAuthenticated,
  menusController.deleteItem
);

router.put(
  '/:menuId/sections/:sectionId/items/:itemId',
  auth.isAuthenticated,
  menusController.updateItem
);

router.put(
  '/:menuId/sections/:sectionId/items/:itemId/image',
  auth.isAuthenticated,
  upload.single('image'),
  menusController.updateItemImage
);

export default router;
