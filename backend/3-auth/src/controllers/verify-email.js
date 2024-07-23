import { getUserByVerificationToken, updateVerifyEmailField } from '@/services/auth.service.js';

export async function verifyEmail(req, res) {
  const { token } = req.body;

  const checkIfUserExist = await getUserByVerificationToken(token);
  if (!checkIfUserExist) {
    throw new Error('Verification token is either invalid or is already used.');
  }

  const user = await updateVerifyEmailField(checkIfUserExist.id, 'verified_user', '');
  const userData = {
    email: user.email,
    username: user.username,
    id: user.id,
    provider: user.provider,
    role: user.role,
  };
  res.status(200).json({ message: 'Email verified successfully.', user: userData });
}
