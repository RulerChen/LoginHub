import pg from 'pg';
import config from '@/config.js';

export const pool = new pg.Pool({
  host: `${config.DATABASE_HOST}`,
  user: `${config.DATABASE_USER}`,
  password: `${config.DATABASE_PASSWORD}`,
  port: `${config.DATABASE_PORT}`,
  database: `${config.DATABASE_NAME}`,
  ...(config.NODE_ENV !== 'development' &&
    config.CLUSTER_TYPE === 'GCP' && {
      ssl: {
        rejectUnauthorized: false,
      },
    }),
});

pool.on('error', () => {
  process.exit(-1);
});

const createTableText = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255),
    provider VARCHAR(255) NOT NULL CHECK (provider IN ('local', 'google', 'github')) DEFAULT 'local',
    role VARCHAR(255) NOT NULL CHECK (role IN ('verified_user', 'unverified_user', 'admin')) DEFAULT 'unverified_user',
    emailVerificationToken VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT now()
  );

  CREATE INDEX IF NOT EXISTS users_email_index ON users(email);
  CREATE INDEX IF NOT EXISTS users_emailVerificationToken_index ON users(emailVerificationToken);
`;

export const databaseConnection = async () => {
  try {
    await pool.connect();
    await pool.query(createTableText);
    console.log('Connected to database successfully.');
  } catch (error) {
    console.log('Connected to database failed.');
    console.log(error);
  }
};
