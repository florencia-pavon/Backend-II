import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();
const { JWT_SECRET = 'changeme', NODE_ENV = 'development' } = process.env;
const COOKIE_NAME = 'jwtCookie';

const signUserToken = (user) =>
  jwt.sign(
    {
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name
      }
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

const setAuthCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24
  });
};

router.post(
  '/register',
  passport.authenticate('register', { session: false, failureRedirect: '/register?error=1' }),
  (req, res) => {
    const nextUrl = req.query.next || '/';
    const token = signUserToken(req.user);
    setAuthCookie(res, token);
    return res.redirect(nextUrl);
  }
);

router.post(
  '/login',
  passport.authenticate('login', { session: false, failureRedirect: '/login?error=1' }),
  (req, res) => {
    const nextUrl = req.query.next || '/';
    const token = signUserToken(req.user);
    setAuthCookie(res, token);
    return res.redirect(nextUrl);
  }
);

router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({ status: 'success', payload: req.user });
  }
);

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME);
  return res.redirect('/login');
});

export default router;
