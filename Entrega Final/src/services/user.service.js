import userRepository from "../repository/user.repository.js";

const getAll = async () => {
  const users = await userRepository.findAllWithoutPassword();
  return users;
};

const getById = async (id) => {
  const user = await userRepository.findByIdWithoutPassword(id);
  return user;
};

const updateById = async (id, data) => {
  const user = await userRepository.updateByIdWithoutPassword(id, data);
  return user;
};

const deleteById = async (id) => {
  const result = await userRepository.deleteById(id);
  return result.deletedCount > 0;
};

export default { getAll, getById, updateById, deleteById };
