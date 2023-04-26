import express from 'express';

import sessionsController from '../controllers/sessions.controller.js';

const router = express.Router();

router.post('/', sessionsController.signIn);
router.delete('/', sessionsController.signOut);

export default router;
