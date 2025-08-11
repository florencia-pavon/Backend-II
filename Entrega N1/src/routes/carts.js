import { Router } from 'express';
import CartModel from '../models/cart.model.js';
import ProductModel from '../models/product.model.js';
import { passportCall } from '../middlewares/passportCall.js';
import { checkRole } from '../middlewares/auth.js';

const router = Router();

router.post('/', passportCall('jwt'), checkRole(['user']), async (req, res) => {
  try {
    const { productId } = req.body;
    const cartId = req.user.cart;

    await CartModel.updateOne(
      { _id: cartId },
      { $setOnInsert: { products: [] } },
      { upsert: true }
    );

    const updated = await CartModel.findOneAndUpdate(
      { _id: cartId, 'products.product': productId },
      { $inc: { 'products.$.quantity': 1 } },
      { new: true }
    );

    if (!updated) {
      await CartModel.updateOne(
        { _id: cartId },
        { $push: { products: { product: productId, quantity: 1 } } }
      );
    }

    return res.redirect(`/carts/${cartId}`);
  } catch {
    return res.status(500).send('Error interno del servidor');
  }
});

router.post('/:cid/product/:pid/decrement', passportCall('jwt'), checkRole(['user']), async (req, res) => {
  try {
    const { cid, pid } = req.params;
    if (String(req.user.cart) !== cid) return res.status(403).json({ status: 'error', message: 'No autorizado' });
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    const item = cart.products.find(p => p.product.toString() === pid);
    if (!item) return res.redirect(`/carts/${cid}`);
    if (item.quantity > 1) {
      item.quantity -= 1;
      await cart.save();
    } else {
      cart.products = cart.products.filter(p => p.product.toString() !== pid);
      await cart.save();
    }
    return res.redirect(`/carts/${cid}`);
  } catch {
    return res.status(500).json({ status: 'error', message: 'Error al decrementar' });
  }
});

router.post('/:cid/product/:pid/remove', passportCall('jwt'), checkRole(['user']), async (req, res) => {
  try {
    const { cid, pid } = req.params;
    if (String(req.user.cart) !== cid) return res.status(403).json({ status: 'error', message: 'No autorizado' });
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    return res.redirect(`/carts/${cid}`);
  } catch {
    return res.status(500).json({ status: 'error', message: 'Error al eliminar' });
  }
});

router.get('/:cid', passportCall('jwt'), checkRole(['user']), async (req, res) => {
  try {
    if (String(req.user.cart) !== req.params.cid) return res.status(403).json({ status: 'error', message: 'No autorizado' });

    let carrito = await CartModel.findById(req.params.cid).populate('products.product').lean();
    if (!carrito) {
      await CartModel.create({ _id: req.params.cid, products: [] });
      carrito = await CartModel.findById(req.params.cid).populate('products.product').lean();
    }

    return res.json({ status: 'success', cart: carrito });
  } catch {
    return res.status(500).json({ status: 'error', message: 'Error al obtener carrito' });
  }
});

router.post('/:cid/product/:pid', passportCall('jwt'), checkRole(['user']), async (req, res) => {
  try {
    const { cid, pid } = req.params;
    if (String(req.user.cart) !== cid) return res.status(403).json({ status: 'error', message: 'No autorizado' });

    const producto = await ProductModel.findById(pid);
    if (!producto) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

    const updated = await CartModel.findOneAndUpdate(
      { _id: cid, 'products.product': pid },
      { $inc: { 'products.$.quantity': 1 } },
      { new: true }
    );

    if (!updated) {
      await CartModel.updateOne(
        { _id: cid },
        { $push: { products: { product: pid, quantity: 1 } } }
      );
    }

    return res.redirect(`/carts/${cid}`);
  } catch {
    return res.status(500).json({ status: 'error', message: 'Error al agregar producto al carrito' });
  }
});

router.delete('/:cid/products/:pid', passportCall('jwt'), checkRole(['user']), async (req, res) => {
  try {
    const { cid, pid } = req.params;
    if (String(req.user.cart) !== cid) return res.status(403).json({ status: 'error', message: 'No autorizado' });

    const carrito = await CartModel.findById(cid);
    if (!carrito) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    carrito.products = carrito.products.filter(p => p.product.toString() !== pid);
    await carrito.save();

    return res.json({ status: 'success', message: 'Producto eliminado del carrito' });
  } catch {
    return res.status(500).json({ status: 'error', message: 'Error al eliminar producto' });
  }
});

router.put('/:cid', passportCall('jwt'), checkRole(['user']), async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    if (String(req.user.cart) !== cid) return res.status(403).json({ status: 'error', message: 'No autorizado' });

    const carrito = await CartModel.findById(cid);
    if (!carrito) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    carrito.products = products;
    await carrito.save();

    return res.json({ status: 'success', cart: carrito });
  } catch {
    return res.status(500).json({ status: 'error', message: 'Error al actualizar productos del carrito' });
  }
});

router.put('/:cid/products/:pid', passportCall('jwt'), checkRole(['user']), async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (String(req.user.cart) !== cid) return res.status(403).json({ status: 'error', message: 'No autorizado' });

    const carrito = await CartModel.findById(cid);
    if (!carrito) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    const producto = carrito.products.find(p => p.product.toString() === pid);
    if (!producto) return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });

    producto.quantity = quantity;
    await carrito.save();

    return res.json({ status: 'success', cart: carrito });
  } catch {
    return res.status(500).json({ status: 'error', message: 'Error al actualizar cantidad' });
  }
});

router.delete('/:cid', passportCall('jwt'), checkRole(['user']), async (req, res) => {
  try {
    const { cid } = req.params;
    if (String(req.user.cart) !== cid) return res.status(403).json({ status: 'error', message: 'No autorizado' });

    const carrito = await CartModel.findById(cid);
    if (!carrito) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    carrito.products = [];
    await carrito.save();

    return res.json({ status: 'success', message: 'Carrito vaciado' });
  } catch {
    return res.status(500).json({ status: 'error', message: 'Error al vaciar carrito' });
  }
});

export default router;
