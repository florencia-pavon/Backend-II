import userDAO from "../DAO/user.dao.js";
import { toUserPublicDTO } from "../DTO/user.dto.js";

const findById = (id) => userDAO.findById(id);

const findByIdWithoutPassword = async (id) => {
  const doc = await userDAO.findByIdSelectLean(id, "-password");
  return doc ? toUserPublicDTO(doc) : null;
};

const findAllWithoutPassword = async () => {
  const docs = await userDAO.findAllSelectLean("-password");
  return docs.map(toUserPublicDTO);
};

const updateByIdWithoutPassword = async (id, data) => {
  const doc = await userDAO.findByIdAndUpdateSelect(id, data, "-password");
  return doc ? toUserPublicDTO(doc) : null;
};

const save = (userDoc) => userDAO.save(userDoc);

const deleteById = (id) => userDAO.deleteById(id);

const findByEmail = (email) => userDAO.findByEmail(email);

export default { findById, findByIdWithoutPassword, findAllWithoutPassword, updateByIdWithoutPassword, save, deleteById, findByEmail };
