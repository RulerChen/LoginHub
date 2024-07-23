import express from 'express';

import { signup, signin, signout, verifyEmail } from '@/controllers/auth.controller.js';

const router = express.Router();

router.post('/auth/signup', signup);
router.post('/auth/signin', signin);
router.post('/auth/signout', signout);
router.put('/auth/verify-email', verifyEmail);

export default router;
