import productService from "../services/product.service.js";

const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const result = await productService.paginate({ limit, page, sort, query });
    return res.json(result);
  } catch {
    return res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productService.findById(req.params.pid);
    if (!product) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    return res.json({ status: "success", product });
  } catch {
    return res.status(500).json({ status: "error", message: "Error al obtener producto" });
  }
};

const createProduct = async (req, res) => {
  try {
    const nuevoProducto = await productService.create(req.body);
    return res.status(201).json({ status: "success", producto: nuevoProducto });
  } catch (error) {
    return res.status(400).json({ status: "error", message: "Error al crear producto", error });
  }
};

const updateProduct = async (req, res) => {
  try {
    const actualizado = await productService.update(req.params.pid, req.body);
    if (!actualizado) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    return res.json({ status: "success", producto: actualizado });
  } catch {
    return res.status(500).json({ status: "error", message: "Error al actualizar producto" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const eliminado = await productService.delete(req.params.pid);
    if (!eliminado) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    return res.json({ status: "success", message: "Producto eliminado" });
  } catch {
    return res.status(500).json({ status: "error", message: "Error al eliminar producto" });
  }
};

export default { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
