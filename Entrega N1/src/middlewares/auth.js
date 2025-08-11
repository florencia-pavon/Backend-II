import passport from 'passport';

export const requireAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      const nextUrl = encodeURIComponent(req.originalUrl || '/');
      return res.redirect(`/login?next=${nextUrl}`);
    }
    req.user = user;
    res.locals.user = user;
    res.locals.cartId = user?.cart?.toString() || '';
    next();
  })(req, res, next);
};

export const guestOnly = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (_err, user) => {
    if (user) return res.redirect('/');
    next();
  })(req, res, next);
};

export const checkRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'No autenticado' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'No autorizado' });
    next();
  };
};
