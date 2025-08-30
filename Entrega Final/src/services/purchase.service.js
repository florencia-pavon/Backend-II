import cartRepository from "../repository/cart.repository.js";
import productRepository from "../repository/product.repository.js";

const checkout = async (cartId) => {
  const cart = await cartRepository.findByIdPopulated(cartId);
  if (!cart || !cart.products?.length) return { ok: true };
  const items = cart.products.map(p => ({ id: String(p.product._id), name: p.product.title || p.product.name || "", requested: p.quantity }));
  const ids = items.map(i => i.id);
  const products = await productRepository.findManyByIds(ids);
  const byId = new Map(products.map(p => [String(p._id), p]));
  const outOfStock = [];
  for (const it of items) {
    const prod = byId.get(it.id);
    const available = prod?.stock ?? 0;
    if (available < it.requested) outOfStock.push({ id: it.id, name: it.name, requested: it.requested, available });
  }
  if (outOfStock.length) return { ok: false, outOfStock };
  const ops = items.map(it => ({
    updateOne: {
      filter: { _id: it.id, stock: { $gte: it.requested } },
      update: { $inc: { stock: -it.requested } }
    }
  }));
  const bulk = await productRepository.bulkWrite(ops);
  if (bulk?.modifiedCount !== items.length) return { ok: false, outOfStock: [] };
  await cartRepository.setProducts(cartId, []);
  return { ok: true };
};

export default { checkout };
