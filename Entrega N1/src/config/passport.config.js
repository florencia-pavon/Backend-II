import passport from 'passport';
import local from 'passport-local';
import jwt from 'passport-jwt';
import dotenv from 'dotenv';
dotenv.config(); 
import UserModel from '../models/user.model.js';
import CartModel from '../models/cart.model.js';
import { createHash, isValidPassword } from '../utils/bcrypt.utils.js';
import { cookieExtractor } from '../utils/jwt.utils.js';

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

passport.use('register', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  async (req, email, password, done) => {
    try {
      const { first_name, last_name, age } = req.body;

      const exists = await UserModel.findOne({ email });
      if (exists) return done(null, false, { message: 'El email ya está registrado' });

      const cart = await CartModel.create({ products: [] });

      const user = await UserModel.create({
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
        cart: cart._id,
        role: 'user'
      });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.use('login', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  async (req, email, password, done) => {
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }

      if (!isValidPassword(user, password)) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.use('jwt', new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: process.env.JWT_SECRET
  },
  async (payload, done) => {
    try {
      const user = await UserModel.findById(payload.user._id);
      if (!user) return done(null, false);
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await UserModel.findById(id);
  done(null, user);
});
