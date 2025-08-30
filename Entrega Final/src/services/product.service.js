import productRepository from "../repository/product.repository.js";

const buildFilterAndOptions = ({ limit, page, sort, query }) => {
  const filtro = {};
  if (query) {
    if (query.startsWith("category=")) {
      const categoria = query.split("=")[1];
      filtro.category = categoria;
    } else if (query.startsWith("available=")) {
      const disponible = query.split("=")[1] === "true";
      filtro.stock = disponible ? { $gt: 0 } : 0;
    }
  }
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : undefined
  };
  return { filtro, options };
};

const paginate = async ({ limit, page, sort, query }) => {
  const { filtro, options } = buildFilterAndOptions({ limit, page, sort, query });
  const result = await productRepository.paginate(filtro, options);
  return {
    status: "success",
    payload: result.docs,
    totalPages: result.totalPages,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
    nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null
  };
};

const findById = (id) => productRepository.findById(id);
const create = (data) => productRepository.create(data);
const update = (id, data) => productRepository.updateById(id, data);
const deleteById = (id) => productRepository.deleteById(id);

export default { paginate, findById, create, update, delete: deleteById };
