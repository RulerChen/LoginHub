import { signinService, signupService, verifyEmailService } from '@/services/auth.service.js';

export const signup = async (req, res) => {
  const response = await signupService(req.body);
  req.session.jwt = response.data.jwt;
  res.status(201).json({ message: response.data.message, user: response.data.user });
};

export const signin = async (req, res, next) => {
  const response = await signinService(req.body);

  req.session.regenerate(function (err) {
    if (err) next(err);

    req.session.jwt = response.data.jwt;

    req.session.save(function (err) {
      if (err) return next(err);
      res.status(200).json({ message: response.data.message, user: response.data.user });
    });
  });
};

export const signout = async (req, res, next) => {
  req.session.jwt = null;
  req.session.save(function (err) {
    if (err) next(err);

    req.session.regenerate(function (err) {
      if (err) next(err);
      res.status(200).json({ message: 'Sign out successful.', user: {} });
    });
  });
};

export const verifyEmail = async (req, res) => {
  const response = await verifyEmailService(req.body);
  res.status(200).json({ message: response.data.message, user: response.data.user });
};
