import ProductModel from "../models/product.model.js";

const findById = (id) => ProductModel.findById(id);
const findByIdLean = (id) => ProductModel.findById(id).lean();
const findAllLean = () => ProductModel.find().lean();
const findManyByIds = (ids) => ProductModel.find({ _id: { $in: ids } }).lean();
const paginate = (filter, options) => ProductModel.paginate(filter, options);
const create = (data) => ProductModel.create(data);
const updateById = (id, data) => ProductModel.findByIdAndUpdate(id, data, { new: true });
const deleteById = (id) => ProductModel.findByIdAndDelete(id);
const bulkWrite = (ops) => ProductModel.bulkWrite(ops);

export default { findById, findByIdLean, findAllLean, findManyByIds, paginate, create, updateById, deleteById, bulkWrite };
