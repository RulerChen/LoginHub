import { jest } from '@jest/globals';

jest.unstable_mockModule('@/services/auth.service.js', () => ({
  getUserByVerificationToken: jest.fn(),
  updateVerifyEmailField: jest.fn(),
}));

const { verifyEmail } = await import('@/controllers/verify-email.js');
const { getUserByVerificationToken, updateVerifyEmailField } = await import('@/services/auth.service.js');

describe('verifyEmail', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.resetAllMocks();

    req = {
      body: {
        token: 'valid-token',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should verify email and return updated user', async () => {
    const user = { id: '1' };
    getUserByVerificationToken.mockResolvedValue(user);
    updateVerifyEmailField.mockResolvedValue(user);

    await verifyEmail(req, res);

    expect(getUserByVerificationToken).toHaveBeenCalledWith('valid-token');
    expect(updateVerifyEmailField).toHaveBeenCalledWith('1', true, '');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Email verified successfully.',
      user: { ...user },
    });
  });

  test('should throw an error if verification token is invalid', async () => {
    getUserByVerificationToken.mockResolvedValue(null);

    await expect(verifyEmail(req, res)).rejects.toThrow('Verification token is either invalid or is already used.');

    expect(getUserByVerificationToken).toHaveBeenCalledWith('valid-token');
    expect(updateVerifyEmailField).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
