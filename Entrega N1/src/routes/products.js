// routes/products.js
import { Router } from 'express';
import ProductModel from '../models/product.model.js';
import { passportCall } from '../middlewares/passportCall.js';
import { checkRole } from '../middlewares/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const filtro = {};
    if (query) {
      if (query.startsWith('category=')) {
        const categoria = query.split('=')[1];
        filtro.category = categoria;
      } else if (query.startsWith('available=')) {
        const disponible = query.split('=')[1] === 'true';
        filtro.stock = disponible ? { $gt: 0 } : 0;
      }
    }
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined
    };
    const result = await ProductModel.paginate(filtro, options);
    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null
    });
  } catch {
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', product });
  } catch {
    res.status(500).json({ status: 'error', message: 'Error al obtener producto' });
  }
});

router.post('/', passportCall('jwt'), checkRole(['admin']), async (req, res) => {
  try {
    const nuevoProducto = await ProductModel.create(req.body);
    res.status(201).json({ status: 'success', producto: nuevoProducto });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Error al crear producto', error });
  }
});

router.put('/:pid', passportCall('jwt'), checkRole(['admin']), async (req, res) => {
  try {
    const actualizado = await ProductModel.findByIdAndUpdate(req.params.pid, req.body, { new: true });
    if (!actualizado) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', producto: actualizado });
  } catch {
    res.status(500).json({ status: 'error', message: 'Error al actualizar producto' });
  }
});

router.delete('/:pid', passportCall('jwt'), checkRole(['admin']), async (req, res) => {
  try {
    const eliminado = await ProductModel.findByIdAndDelete(req.params.pid);
    if (!eliminado) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', message: 'Producto eliminado' });
  } catch {
    res.status(500).json({ status: 'error', message: 'Error al eliminar producto' });
  }
});

export default router;
