import 'express-async-errors';

import express from 'express';
import cors from 'cors';

import routes from '@/routes/index.js';
import config from '@/config.js';
import { consumeAuthEmailMessages } from '@/queues/consumer.js';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(`/api`, routes);

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
  consumeAuthEmailMessages();
  console.log(`Server is running on port ${config.PORT}`);
});

export default app;
