import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import UserModel from '../models/user.model.js';
import { createHash } from '../utils/bcrypt.utils.js';
import { passportCall } from '../middlewares/passportCall.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  try {
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    const hashedPassword = createHash(password);
    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    });

    res.status(201).json({ status: 'success', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

router.post('/login', passport.authenticate('login', { session: false }), async (req, res) => {
  const user = req.user;

  const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res
    .cookie('jwtCookie', token, {
      httpOnly: true,
      secure: false, // poné true si usás HTTPS
      maxAge: 3600000
    })
    .status(200)
    .json({ status: 'success', message: 'Login exitoso' });
});

router.get('/current', passportCall('jwt'), (req, res) => {
  res.json({
    status: 'success',
    payload: req.user
  });
});

export default router;
