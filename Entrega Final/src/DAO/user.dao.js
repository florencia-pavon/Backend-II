import UserModel from "../models/user.model.js";

const findById = (id) => UserModel.findById(id);
const findByIdSelectLean = (id, projection) => UserModel.findById(id).select(projection).lean();
const findAllSelectLean = (projection) => UserModel.find().select(projection).lean();
const findByIdAndUpdateSelect = (id, data, projection) => UserModel.findByIdAndUpdate(id, data, { new: true }).select(projection);
const findByEmail = (email) => UserModel.findOne({ email });
const save = (userDoc) => userDoc.save();
const deleteById = (id) => UserModel.deleteOne({ _id: id });

export default { findById, findByIdSelectLean, findAllSelectLean, findByIdAndUpdateSelect, findByEmail, save, deleteById };
