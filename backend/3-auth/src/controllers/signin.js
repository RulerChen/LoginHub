import bcrypt from 'bcrypt';

import { getUserByEmail, signToken } from '@/services/auth.service.js';

export async function signin(req, res) {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials', 'SignIn read() method error');
  }

  const passwordsMatch = bcrypt.compareSync(password, user.password);
  if (!passwordsMatch) {
    throw new Error('Invalid credentials', 'SignIn read() method error');
  }

  const userJWT = signToken(user.id, user.email, user.username, user.role);
  const userData = {
    email: user.email,
    username: user.username,
    id: user.id,
    provider: user.provider,
    role: user.role,
  };

  res.status(200).json({ message: 'User login successfully', user: userData, jwt: userJWT });
}
