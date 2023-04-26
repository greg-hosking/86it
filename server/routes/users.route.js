import express from 'express';

import usersController from '../controllers/users.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', usersController.createUser);

router.put('/email-verification', usersController.updateEmailVerifiedWithToken);

router.get('/password-reset', usersController.getPasswordResetToken);
router.put('/password-reset', usersController.updatePasswordWithToken);

router.get('/me', auth.isAuthenticated, usersController.getAuthenticatedUser);

export default router;
