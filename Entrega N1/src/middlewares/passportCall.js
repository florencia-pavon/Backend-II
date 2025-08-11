import passport from 'passport';

export const passportCall = (strategy) => (req, res, next) => {
  passport.authenticate(strategy, { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info?.message || 'No autorizado' });
    req.user = user;
    next();
  })(req, res, next);
};
