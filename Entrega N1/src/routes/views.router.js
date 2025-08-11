import { Router } from 'express';
import ProductModel from '../models/product.model.js';
import CartModel from '../models/cart.model.js';
import { requireAuth, guestOnly, checkRole } from '../middlewares/auth.js';

const router = Router();

const qs = (obj = {}) =>
  Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');

router.get('/', requireAuth, async (req, res) => {
  try {
    const { limit = 3, page = 1, sort, query } = req.query;
    const filtro = {};
    if (query) {
      if (query.startsWith('category=')) {
        filtro.category = query.split('=')[1];
      } else if (query.startsWith('available=')) {
        const disponible = query.split('=')[1] === 'true';
        filtro.stock = disponible ? { $gt: 0 } : 0;
      }
    }
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined,
      lean: true
    };
    const result = await ProductModel.paginate(filtro, options);
    const baseQuery = qs({ limit, sort, query });
    const prevLink = result.hasPrevPage ? `/?${qs({ page: result.prevPage })}${baseQuery ? `&${baseQuery}` : ''}` : null;
    const nextLink = result.hasNextPage ? `/?${qs({ page: result.nextPage })}${baseQuery ? `&${baseQuery}` : ''}` : null;
    res.render('home', {
      title: 'Home',
      productos: result.docs,
      page: result.page,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink
    });
  } catch (error) {
    res.status(500).send('Error al obtener productos');
  }
});

router.get('/realtimeproducts', requireAuth, checkRole(['admin']), async (req, res) => {
  try {
    const productos = await ProductModel.find().lean();
    res.render('realTimeProducts', { title: 'Tiempo Real', productos });
  } catch (error) {
    res.status(500).send('Error al obtener productos');
  }
});

router.get('/products/:pid', requireAuth, async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).lean();
    if (!product) return res.status(404).send('Producto no encontrado');
    const cart = await CartModel.findOne();
    const cartId = cart?._id?.toString() || '';
    res.render('productDetail', {
      title: 'Detalle del producto',
      product,
      cartId
    });
  } catch (error) {
    res.status(500).send('Error al obtener el producto');
  }
});

router.get('/carts/:cid', requireAuth, async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).populate('products.product').lean();
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.render('cartDetail', {
      title: 'Carrito',
      cart
    });
  } catch (error) {
    res.status(500).send('Error al obtener el carrito');
  }
});

router.get('/checkout', requireAuth, async (req, res) => {
  const cart = await CartModel.findById(req.user.cart).populate('products.product').lean();
  res.render('checkout', { title: 'Checkout', cart });
});

router.post('/checkout/confirm', requireAuth, async (req, res) => {
  await CartModel.updateOne({ _id: req.user.cart }, { $set: { products: [] } });
  res.render('orderSuccess', { title: 'Compra realizada' });
});


router.get('/login', guestOnly, (req, res) => {
  res.render('login', { title: 'Iniciar sesión', next: req.query.next || '/' });
});

router.get('/register', guestOnly, (req, res) => {
  res.render('register', { title: 'Registro', next: req.query.next || '/', query: req.query });
});

export default router;
