import 'express-async-errors';

import cors from 'cors';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import jwt from 'jsonwebtoken';

import routes from '@/routes/index.js';
import { databaseConnection } from '@/models/db.js';
import config from '@/config.js';

const app = express();

app.set('trust proxy', 1);

app.use(compression());
app.use(express.urlencoded({ extended: true, limit: '200mb' }));
app.use(express.json({ limit: '200mb' }));
app.use(
  cors({
    origin: config.API_GATEWAY_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }),
);

app.use(hpp());
app.use(helmet());

app.use(`/api`, routes);
app.use((req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    const payload = jwt.verify(token, config.JWT_TOKEN);
    req.currentUser = payload;
  }
  next();
});

// route not found
app.use('*', (req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  res.status(404).json({ message: `${fullUrl} does not exist.` });
  next();
});

// error handler
app.use((err, req, res, next) => {
  if (err) {
    res.status(err.status ?? 500).json({ message: err?.message ?? 'Error occurred.' });
  }
  next();
});

app.listen(config.PORT, () => {
  databaseConnection();
  console.log(`Server is running on port ${config.PORT}`);
});

export default app;
