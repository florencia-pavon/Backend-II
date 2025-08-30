import cartDAO from "../DAO/cart.dao.js";

const createIfNotExists = (cartId) => cartDAO.createIfNotExists(cartId);
const incrementProduct = (cartId, productId) => cartDAO.incrementProduct(cartId, productId);
const addProduct = (cartId, productId, quantity) => cartDAO.addProduct(cartId, productId, quantity);
const findById = (id) => cartDAO.findById(id);
const findByIdLean = (id) => cartDAO.findByIdLean(id);
const findByIdPopulated = (id) => cartDAO.findByIdPopulated(id);
const findFirst = () => cartDAO.findFirst();
const createCart = (id) => cartDAO.createCart(id);
const deleteById = (id) => cartDAO.deleteById(id);
const setProducts = (id, products) => cartDAO.setProducts(id, products);
const getItemQuantity = async (cid, pid) => {
  const cart = await cartDAO.findByIdLean(cid);
  if (!cart) return 0;
  const item = cart.products?.find(p => String(p.product) === String(pid));
  return item ? item.quantity : 0;
};

export default { createIfNotExists, incrementProduct, addProduct, findById, findByIdLean, findByIdPopulated, findFirst, createCart, deleteById, setProducts, getItemQuantity };
