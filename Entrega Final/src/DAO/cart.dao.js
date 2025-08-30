import CartModel from "../models/cart.model.js";

const createIfNotExists = (cartId) =>
  CartModel.updateOne({ _id: cartId }, { $setOnInsert: { products: [] } }, { upsert: true });

const incrementProduct = (cartId, productId) =>
  CartModel.findOneAndUpdate({ _id: cartId, "products.product": productId }, { $inc: { "products.$.quantity": 1 } }, { new: true });

const addProduct = (cartId, productId, quantity) =>
  CartModel.updateOne({ _id: cartId }, { $push: { products: { product: productId, quantity } } });

const findById = (id) => CartModel.findById(id);
const findByIdLean = (id) => CartModel.findById(id).lean();
const findByIdPopulated = (id) => CartModel.findById(id).populate("products.product").lean();
const findFirst = () => CartModel.findOne();
const createCart = (id) => CartModel.create({ _id: id, products: [] });
const deleteById = (id) => CartModel.deleteOne({ _id: id });
const setProducts = (id, products) => CartModel.updateOne({ _id: id }, { $set: { products } });

export default { createIfNotExists, incrementProduct, addProduct, findById, findByIdLean, findByIdPopulated, findFirst, createCart, deleteById, setProducts };
