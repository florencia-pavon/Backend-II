import { Router } from "express";
import { passportCall } from "../middlewares/passportCall.js";
import { checkRole } from "../middlewares/auth.js";
import productController from "../controllers/product.controller.js";

const router = Router();

router.get("/", productController.getProducts);
router.get("/:pid", productController.getProductById);
router.post("/", passportCall("jwt"), checkRole(["admin"]), productController.createProduct);
router.put("/:pid", passportCall("jwt"), checkRole(["admin"]), productController.updateProduct);
router.delete("/:pid", passportCall("jwt"), checkRole(["admin"]), productController.deleteProduct);

export default router;
