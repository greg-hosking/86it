import express from 'express';

import usersController from '../controllers/users.controller.js';
import auth from '../middleware/auth.middleware.js';

import upload from '../utils/upload.js';

const router = express.Router();

router.post('/', usersController.signUp);
router.get('/me', auth.isAuthenticated, usersController.getAuthenticatedUser);
router.put(
  '/me',
  auth.isAuthenticated,
  usersController.updateAuthenticatedUser
);
router.put(
  '/me/avatar',
  auth.isAuthenticated,
  upload.single('image'),
  usersController.updateAuthenticatedUserAvatar
);
router.delete(
  '/me/avatar',
  auth.isAuthenticated,
  usersController.deleteAuthenticatedUserAvatar
);
router.delete(
  '/me',
  auth.isAuthenticated,
  usersController.deleteAuthenticatedUser
);

// Email verification
router.put('/me/email-verification', usersController.verifyEmail);

// Password reset
router.get('/me/password-reset', usersController.requestPasswordReset);
router.put('/me/password-reset', usersController.resetPassword);

export default router;
