import cartService from "../services/cart.service.js";

const createOrAddProductToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const cartId = req.user.cart;
    const result = await cartService.createOrAddProduct(cartId, productId);
    if (!result.ok && result.code === "NO_STOCK") return res.redirect(`/carts/${cartId}?err=nostock`);
    return res.redirect(`/carts/${cartId}`);
  } catch {
    return res.status(500).send("Error interno del servidor");
  }
};

const decrementProduct = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    if (String(req.user.cart) !== cid) return res.status(403).json({ status: "error", message: "No autorizado" });
    await cartService.decrementProduct(cid, pid);
    return res.redirect(`/carts/${cid}`);
  } catch {
    return res.status(500).json({ status: "error", message: "Error al decrementar" });
  }
};

const removeProduct = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    if (String(req.user.cart) !== cid) return res.status(403).json({ status: "error", message: "No autorizado" });
    await cartService.removeProduct(cid, pid);
    return res.redirect(`/carts/${cid}`);
  } catch {
    return res.status(500).json({ status: "error", message: "Error al eliminar" });
  }
};

const getCartById = async (req, res) => {
  try {
    if (String(req.user.cart) !== req.params.cid) return res.status(403).json({ status: "error", message: "No autorizado" });
    const cart = await cartService.getCartById(req.params.cid);
    return res.json({ status: "success", cart });
  } catch {
    return res.status(500).json({ status: "error", message: "Error al obtener carrito" });
  }
};

const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    if (String(req.user.cart) !== cid) return res.status(403).json({ status: "error", message: "No autorizado" });
    const result = await cartService.addProduct(cid, pid);
    if (!result.ok && result.code === "NO_STOCK") return res.redirect(`/carts/${cid}?err=nostock`);
    return res.redirect(`/carts/${cid}`);
  } catch {
    return res.status(500).json({ status: "error", message: "Error al agregar producto al carrito" });
  }
};

const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    if (String(req.user.cart) !== cid) return res.status(403).json({ status: "error", message: "No autorizado" });
    await cartService.deleteProduct(cid, pid);
    return res.json({ status: "success", message: "Producto eliminado del carrito" });
  } catch {
    return res.status(500).json({ status: "error", message: "Error al eliminar producto" });
  }
};

const updateCartProducts = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    if (String(req.user.cart) !== cid) return res.status(403).json({ status: "error", message: "No autorizado" });
    const result = await cartService.updateCartProducts(cid, products);
    if (!result.ok && result.code === "NO_STOCK") return res.status(400).json({ status: "error", message: "Sin stock suficiente" });
    return res.json({ status: "success", cart: result.cart });
  } catch {
    return res.status(500).json({ status: "error", message: "Error al actualizar productos del carrito" });
  }
};

const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (String(req.user.cart) !== cid) return res.status(403).json({ status: "error", message: "No autorizado" });
    const result = await cartService.updateProductQuantity(cid, pid, quantity);
    if (result === null) return res.status(404).json({ status: "error", message: "Producto no encontrado en el carrito" });
    if (result.code === "NO_STOCK") return res.status(400).json({ status: "error", message: "Sin stock suficiente" });
    return res.json({ status: "success", cart: result.cart });
  } catch {
    return res.status(500).json({ status: "error", message: "Error al actualizar cantidad" });
  }
};

const emptyCart = async (req, res) => {
  try {
    const { cid } = req.params;
    if (String(req.user.cart) !== cid) return res.status(403).json({ status: "error", message: "No autorizado" });
    await cartService.emptyCart(cid);
    return res.json({ status: "success", message: "Carrito vaciado" });
  } catch {
    return res.status(500).json({ status: "error", message: "Error al vaciar carrito" });
  }
};

export default { createOrAddProductToCart, decrementProduct, removeProduct, getCartById, addProductToCart, deleteProductFromCart, updateCartProducts, updateProductQuantity, emptyCart };
