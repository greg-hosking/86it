import express from 'express';

import authController from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/verification', authController.verifyEmail);

router.post('/forgot-password', authController.sendResetPasswordEmail);

router.post('/reset-password', authController.resetPassword);

router.post('/', authController.signIn);

export default router;
