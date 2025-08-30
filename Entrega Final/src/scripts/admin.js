import dotenv from 'dotenv';
import mongoose from 'mongoose';
import UserModel from '../models/user.model.js';
import CartModel from '../models/cart.model.js';
import { createHash } from '../utils/bcrypt.utils.js';

dotenv.config();

const { MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) process.exit(1);

(async () => {
  await mongoose.connect(MONGO_URI);

  let user = await UserModel.findOne({ email: ADMIN_EMAIL });
  if (!user) {
    const cart = await CartModel.create({ products: [] });
    user = await UserModel.create({
      first_name: 'Admin',
      last_name: 'Root',
      email: ADMIN_EMAIL,
      age: 0,
      password: createHash(ADMIN_PASSWORD),
      role: 'admin',
      cart: cart._id
    });
  }

  console.log('Admin listo:', user.email);
  await mongoose.disconnect();
  process.exit(0);
})();
