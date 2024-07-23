import express from 'express';

import authRoutes from '@/routes/auth.route.js';
import { verifyGatewayRequest } from '@/utils/verifyGateway.js';
import config from '@/config.js';

const router = express.Router();
const BASE_PATH = `/${config.API_VERSION}/auth`;

router.get('/healthy', (req, res) => {
  res.send('Auth service is healthy.');
});

router.use(BASE_PATH, verifyGatewayRequest, authRoutes);

export default router;
