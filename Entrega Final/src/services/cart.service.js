import cartRepository from "../repository/cart.repository.js";
import productRepository from "../repository/product.repository.js";

const canAddUnits = async (cid, pid, unitsToAdd) => {
  const prod = await productRepository.findByIdLean(pid);
  if (!prod) return { ok: false, code: "NO_PRODUCT" };
  const stock = prod.stock || 0;
  const currentQty = await cartRepository.getItemQuantity(cid, pid);
  const desired = (currentQty || 0) + unitsToAdd;
  if (desired > stock) return { ok: false, code: "NO_STOCK", stock, desired, currentQty };
  return { ok: true, stock, desired, currentQty };
};

const createOrAddProduct = async (cartId, productId) => {
  await cartRepository.createIfNotExists(cartId);
  const check = await canAddUnits(cartId, productId, 1);
  if (!check.ok && check.code === "NO_STOCK") return { ok: false, code: "NO_STOCK" };
  const updated = await cartRepository.incrementProduct(cartId, productId);
  if (!updated) await cartRepository.addProduct(cartId, productId, 1);
  return { ok: true };
};

const addProduct = async (cid, pid) => {
  const check = await canAddUnits(cid, pid, 1);
  if (!check.ok && check.code === "NO_STOCK") return { ok: false, code: "NO_STOCK" };
  const updated = await cartRepository.incrementProduct(cid, pid);
  if (!updated) await cartRepository.addProduct(cid, pid, 1);
  return { ok: true };
};

const decrementProduct = async (cid, pid) => {
  const cart = await cartRepository.findById(cid);
  if (!cart) throw new Error("Cart not found");
  const item = cart.products.find(p => p.product.toString() === pid);
  if (!item) return;
  if (item.quantity > 1) {
    item.quantity -= 1;
    await cart.save();
  } else {
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
  }
};

const removeProduct = async (cid, pid) => {
  const cart = await cartRepository.findById(cid);
  if (!cart) throw new Error("Cart not found");
  cart.products = cart.products.filter(p => p.product.toString() !== pid);
  await cart.save();
};

const getCartById = async (cid) => {
  let cart = await cartRepository.findByIdPopulated(cid);
  if (!cart) {
    await cartRepository.createCart(cid);
    cart = await cartRepository.findByIdPopulated(cid);
  }
  return cart;
};

const deleteProduct = async (cid, pid) => {
  const cart = await cartRepository.findById(cid);
  if (!cart) throw new Error("Cart not found");
  cart.products = cart.products.filter(p => p.product.toString() !== pid);
  await cart.save();
  return true;
};

const updateCartProducts = async (cid, products) => {
  const ids = products.map(p => String(p.product));
  const prods = await productRepository.findManyByIds(ids);
  const byId = new Map(prods.map(p => [String(p._id), p.stock || 0]));
  for (const p of products) {
    const stock = byId.get(String(p.product)) ?? 0;
    if (p.quantity > stock) return { ok: false, code: "NO_STOCK" };
  }
  const cart = await cartRepository.findById(cid);
  if (!cart) throw new Error("Cart not found");
  cart.products = products;
  await cart.save();
  return { ok: true, cart };
};

const updateProductQuantity = async (cid, pid, quantity) => {
  const prod = await productRepository.findByIdLean(pid);
  if (!prod) return null;
  const stock = prod.stock || 0;
  if (quantity > stock) return { code: "NO_STOCK" };
  const cart = await cartRepository.findById(cid);
  if (!cart) throw new Error("Cart not found");
  const item = cart.products.find(p => p.product.toString() === pid);
  if (!item) return null;
  item.quantity = quantity;
  await cart.save();
  return { cart };
};

const emptyCart = async (cid) => {
  const cart = await cartRepository.findById(cid);
  if (!cart) throw new Error("Cart not found");
  cart.products = [];
  await cart.save();
};

export default { createOrAddProduct, addProduct, decrementProduct, removeProduct, getCartById, deleteProduct, updateCartProducts, updateProductQuantity, emptyCart };
