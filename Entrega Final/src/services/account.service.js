import userRepository from "../repository/user.repository.js";
import cartRepository from "../repository/cart.repository.js";
import { createHash, isValidPassword } from "../utils/bcrypt.utils.js";

const getAccountPublic = async (userId) => {
  const user = await userRepository.findByIdWithoutPassword(userId);
  if (!user) throw Object.assign(new Error("User not found"), { code: "USER_NOT_FOUND" });
  return user;
};

const updateProfile = async ({ userId, first_name, last_name, age, currentPassword, newPassword }) => {
  const user = await userRepository.findById(userId);
  if (!user) throw Object.assign(new Error("User not found"), { code: "USER_NOT_FOUND" });
  if (first_name !== undefined) user.first_name = first_name;
  if (last_name !== undefined) user.last_name = last_name;
  if (age !== undefined) user.age = age;
  if (newPassword) {
    const ok = isValidPassword(user, currentPassword);
    if (!ok) throw Object.assign(new Error("Bad password"), { code: "BAD_PASSWORD" });
    user.password = createHash(newPassword);
  }
  await userRepository.save(user);
  return true;
};

const deleteAccount = async ({ userId, cartId }) => {
  if (cartId) await cartRepository.deleteById(cartId);
  await userRepository.deleteById(userId);
  return true;
};

export default { getAccountPublic, updateProfile, deleteAccount };
