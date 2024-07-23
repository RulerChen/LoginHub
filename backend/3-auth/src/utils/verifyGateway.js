import jwt from 'jsonwebtoken';

import config from '@/config.js';

export function verifyGatewayRequest(req, res, next) {
  if (!req.headers?.gatewaytoken) {
    throw new Error('Gateway token is required');
  }
  const token = req.headers?.gatewaytoken;
  if (!token) {
    throw new Error('Gateway token is required');
  }

  try {
    const payload = jwt.verify(token, config.GATEWAY_JWT_TOKEN);
    if (payload.id !== 'auth') {
      throw new Error('Invalid gateway token');
    }
  } catch (error) {
    throw new Error('Invalid gateway token');
  }
  next();
}
