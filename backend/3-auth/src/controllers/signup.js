import crypto from 'crypto';
import bcrypt from 'bcrypt';

import config from '@/config.js';
import { createAuthUser, getUserByUsernameOrEmail, signToken } from '@/services/auth.service.js';
import { publishDirectMessage } from '@/queues/producer.js';

const saltRounds = 10;

export async function signup(req, res) {
  const { username, email, password } = req.body;
  const checkIfUserExist = await getUserByUsernameOrEmail(username, email);
  if (checkIfUserExist) {
    throw new Error('Invalid credentials. Email or Username', 'SignUp create() method error');
  }

  const randomBytes = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters = randomBytes.toString('hex');
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  const authData = {
    username,
    email,
    password: hashedPassword,
    emailVerificationToken: randomCharacters,
  };
  const user = await createAuthUser(authData);

  const userData = {
    email: user.email,
    username: user.username,
    id: user.id,
    provider: user.provider,
    role: user.role,
  };
  const userJWT = signToken(user.id, user.email, user.username, user.role);

  const message = {
    receiverEmail: user.email,
    verifyLink: `${config.CLIENT_URL}/confirm_email?v_token=${authData.emailVerificationToken}`,
    template: 'verifyEmail',
  };
  await publishDirectMessage('notification', 'auth.signup.email', JSON.stringify(message));

  res.status(201).json({ message: 'User created successfully', user: userData, jwt: userJWT });
}
