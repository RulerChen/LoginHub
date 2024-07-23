import { jest } from '@jest/globals';
import { signout } from '@/controllers/auth.controller.js';

describe('Auth Controller', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.resetAllMocks();

    req = {
      session: {
        jwt: 'jwt',
        regenerate: jest.fn((callback) => callback()),
        save: jest.fn((callback) => callback()),
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signout method', () => {
    test('should sign out user and clear session', async () => {
      await signout(req, res);

      expect(req.session.jwt).toBeNull();
      expect(req.session.save).toHaveBeenCalled();
      expect(req.session.regenerate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Sign out successful.', user: {} });
    });

    test('should call next with error if save fails', async () => {
      const error = new Error('Save failed');
      req.session.save = jest.fn((callback) => callback(error));

      await signout(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    test('should call next with error if regenerate fails', async () => {
      const error = new Error('Regenerate failed');
      req.session.regenerate = jest.fn((callback) => callback(error));

      await signout(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
