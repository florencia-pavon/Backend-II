import productRepository from "../repository/product.repository.js";
import cartRepository from "../repository/cart.repository.js";

const buildQS = (obj = {}) =>
  Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

const buildFilterAndOptions = ({ limit, page, sort, query, lean = true }) => {
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
    sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : undefined,
    lean
  };
  return { filtro, options };
};

const getHomeData = async ({ limit, page, sort, query }) => {
  const { filtro, options } = buildFilterAndOptions({ limit, page, sort, query, lean: true });
  const result = await productRepository.paginate(filtro, options);
  const baseQuery = buildQS({ limit, sort, query });
  const prevLink = result.hasPrevPage ? `/?${buildQS({ page: result.prevPage })}${baseQuery ? `&${baseQuery}` : ""}` : null;
  const nextLink = result.hasNextPage ? `/?${buildQS({ page: result.nextPage })}${baseQuery ? `&${baseQuery}` : ""}` : null;
  return {
    title: "Home",
    productos: result.docs,
    page: result.page,
    totalPages: result.totalPages,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink,
    nextLink
  };
};

const getAllProductsLean = () => productRepository.findAllLean();
const getProductLean = (id) => productRepository.findByIdLean(id);
const getAnyCartId = async () => {
  const cart = await cartRepository.findFirst();
  return cart?._id?.toString() || "";
};
const getCartPopulatedLean = (id) => cartRepository.findByIdPopulated(id);

export default { getHomeData, getAllProductsLean, getProductLean, getAnyCartId, getCartPopulatedLean };
