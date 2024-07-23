import express from 'express';

import authRoutes from '@/routes/auth.route.js';
import config from '@/config.js';

const router = express.Router();
const BASE_PATH = `/${config.API_VERSION}/gateway`;

router.get('/healthy', (req, res) => {
  res.send('API Gateway service is healthy.');
});

router.use(BASE_PATH, authRoutes);

export default router;
