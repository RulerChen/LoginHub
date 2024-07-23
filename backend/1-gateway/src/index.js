import 'express-async-errors';

import axios from 'axios';
import cors from 'cors';
import compression from 'compression';
import RedisStore from 'connect-redis';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import hpp from 'hpp';

import routes from '@/routes/index.js';
import config from '@/config.js';
import { createRedisClient } from '@/models/redis.js';
import { axiosAuthInstance } from '@/services/auth.service.js';

const app = express();

app.set('trust proxy', 1);

app.use(compression());
app.use(express.urlencoded({ extended: true, limit: '200mb' }));
app.use(express.json({ limit: '200mb' }));
app.use(
  cors({
    origin: config.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }),
);

app.use(
  session({
    secret: config.SECRET_KEY,
    name: 'session',
    store: new RedisStore({ client: createRedisClient(), prefix: 'session:' }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === 'production',
      ...(process.env.NODE_ENV === 'production' && {
        sameSite: 'none',
      }),
    },
  }),
);
app.use(hpp());
app.use(helmet());

app.use(`/api`, routes);

app.use((req, res, next) => {
  if (req.session?.jwt) {
    axiosAuthInstance.defaults.headers.Authorization = `Bearer ${req.session.jwt}`;
  }
  next();
});

// route not found
app.use('*', (req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  res.status(404).json({ message: `${fullUrl} ${req.method} request does not exist.` });
  next();
});

// error handler
app.use((err, req, res, next) => {
  if (axios.isAxiosError(err)) {
    res.status(err?.response?.data?.statusCode ?? 500).json({ message: err?.response?.data?.message ?? 'Error occurred.' });
  } else if (err) {
    res.status(err.status ?? 500).json({ message: err?.message ?? 'Error occurred.' });
  }
  next();
});

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});

export default app;
