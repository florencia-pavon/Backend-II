import productDAO from "../DAO/product.dao.js";

const findById = (id) => productDAO.findById(id);
const findByIdLean = (id) => productDAO.findByIdLean(id);
const findAllLean = () => productDAO.findAllLean();
const findManyByIds = (ids) => productDAO.findManyByIds(ids);
const paginate = (filter, options) => productDAO.paginate(filter, options);
const create = (data) => productDAO.create(data);
const updateById = (id, data) => productDAO.updateById(id, data);
const deleteById = (id) => productDAO.deleteById(id);
const bulkWrite = (ops) => productDAO.bulkWrite(ops);

export default { findById, findByIdLean, findAllLean, findManyByIds, paginate, create, updateById, deleteById, bulkWrite };
