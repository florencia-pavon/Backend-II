import viewsService from "../services/view.service.js";
import purchaseService from "../services/purchase.service.js";

const home = async (req, res) => {
  try {
    const { limit = 3, page = 1, sort, query } = req.query;
    const data = await viewsService.getHomeData({ limit, page, sort, query });
    return res.render("home", data);
  } catch {
    return res.status(500).send("Error al obtener productos");
  }
};

const realTimeProducts = async (req, res) => {
  try {
    const productos = await viewsService.getAllProductsLean();
    return res.render("realTimeProducts", { title: "Tiempo Real", productos });
  } catch {
    return res.status(500).send("Error al obtener productos");
  }
};

const productDetail = async (req, res) => {
  try {
    const product = await viewsService.getProductLean(req.params.pid);
    if (!product) return res.status(404).send("Producto no encontrado");
    const cartId = await viewsService.getAnyCartId();
    return res.render("productDetail", { title: "Detalle del producto", product, cartId });
  } catch {
    return res.status(500).send("Error al obtener el producto");
  }
};

const cartDetail = async (req, res) => {
  try {
    const cart = await viewsService.getCartPopulatedLean(req.params.cid);
    if (!cart) return res.status(404).send("Carrito no encontrado");
    const err = req.query.err || null;
    return res.render("cartDetail", { title: "Carrito", cart, err });
  } catch {
    return res.status(500).send("Error al obtener el carrito");
  }
};

const checkout = async (req, res) => {
  const cart = await viewsService.getCartPopulatedLean(req.user.cart);
  return res.render("checkout", { title: "Checkout", cart });
};

const checkoutConfirm = async (req, res) => {
  const result = await purchaseService.checkout(req.user.cart, req.user);
  if (!result.ok) {
    const cart = await viewsService.getCartPopulatedLean(req.user.cart);
    const names = result.outOfStock.map(i => `${i.name} (${i.available}/${i.requested})`).join(", ");
    return res.render("checkout", { title: "Checkout", cart, error: `Sin stock suficiente: ${names}` });
  }
  return res.render("orderSuccess", { title: "Compra realizada" });
};


const login = (req, res) => {
  return res.render("login", { title: "Iniciar sesión", next: req.query.next || "/" });
};

const register = (req, res) => {
  return res.render("register", { title: "Registro", next: req.query.next || "/", query: req.query });
};

const forgotPassword = (req, res) => {
  const sent = req.query.sent === "1";
  return res.render("forgotPassword", { title: "Recuperar contraseña", sent });
};

const resetPasswordForm = (req, res) => {
  const { token, error } = req.query;
  return res.render("resetPassword", { title: "Restablecer contraseña", token, error });
};

export default { home, realTimeProducts, productDetail, cartDetail, checkout, checkoutConfirm, login, register, forgotPassword, resetPasswordForm };
