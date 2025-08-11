import { Router } from 'express';
import UserModel from '../models/user.model.js';
import CartModel from '../models/cart.model.js';
import { requireAuth } from '../middlewares/auth.js';
import { createHash, isValidPassword } from '../utils/bcrypt.utils.js';

const router = Router();

router.get('/account', requireAuth, async (req, res) => {
  const user = await UserModel.findById(req.user._id).select('-password').lean();
  res.render('account', { title: 'Mi cuenta', user, ok: req.query.ok, err: req.query.err });
});

router.post('/account/update', requireAuth, async (req, res) => {
  const { first_name, last_name, age, currentPassword, newPassword } = req.body;
  const user = await UserModel.findById(req.user._id);
  if (!user) return res.redirect('/login');
  if (first_name !== undefined) user.first_name = first_name;
  if (last_name !== undefined) user.last_name = last_name;
  if (age !== undefined) user.age = age;
  if (newPassword) {
    if (!isValidPassword(user, currentPassword)) return res.redirect('/account?err=badpass');
    user.password = createHash(newPassword);
  }
  await user.save();
  res.redirect('/account?ok=1');
});

router.post('/account/delete', requireAuth, async (req, res) => {
  await CartModel.deleteOne({ _id: req.user.cart });
  await UserModel.deleteOne({ _id: req.user._id });
  res.clearCookie('jwtCookie');
  res.redirect('/login');
});

export default router;
