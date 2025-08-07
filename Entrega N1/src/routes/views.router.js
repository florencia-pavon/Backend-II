import { Router } from 'express';
import ProductModel from '../models/product.model.js';
import CartModel from '../models/cart.model.js';

const router = Router();

// Vista Home con productos paginados
router.get('/', async (req, res) => {
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

    res.render('home', {
      title: 'Home',
      productos: result.docs,
      page: result.page,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/?page=${result.nextPage}` : null
    });
  } catch (error) {
    console.error('Error al obtener productos paginados:', error);
    res.status(500).send('Error al obtener productos');
  }
});

// Vista RealTimeProducts con WebSocket
router.get('/realtimeproducts', async (req, res) => {
  try {
    const productos = await ProductModel.find().lean();
    res.render('realTimeProducts', { title: 'Tiempo Real', productos });
  } catch (error) {
    res.status(500).send('Error al obtener productos');
  }
});

// Vista detalle de producto
router.get('/products/:pid', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).lean();

    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }

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

// Vista detalle de carrito
router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).populate('products.product').lean();

    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }

    res.render('cartDetail', {
      title: 'Carrito',
      cart
    });
  } catch (error) {
    res.status(500).send('Error al obtener el carrito');
  }
});

// Vista de login
router.get('/login', (req, res) => {
  res.render('login');
});

// Vista de registro
router.get('/register', (req, res) => {
  res.render('register');
});

// Vista de checkout (carrito finalizado)
router.get('/checkout', async (req, res) => {
  const cart = await CartModel.findOne().populate('products.product').lean();
  res.render('checkout', {
    title: 'Checkout',
    cart
  });
});




export default router;
