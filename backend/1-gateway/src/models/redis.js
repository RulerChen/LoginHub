import { createClient } from 'redis';

import config from '@/config.js';

export function createRedisClient() {
  const redisClient = createClient({
    url: `redis://${config.REDIS_HOST}:${config.REDIS_PORT}`,
  });
  redisClient.on('error', (err) => {
    console.error('Connected to Redis failed. ', err);
  });
  redisClient.connect().then(() => {
    console.log('Connected to Redis successfully.');
  });

  return redisClient;
}
