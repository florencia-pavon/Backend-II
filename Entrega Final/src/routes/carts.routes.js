import { Router } from "express";
import { passportCall } from "../middlewares/passportCall.js";
import { checkRole } from "../middlewares/auth.js";
import cartController from "../controllers/cart.controller.js";

const router = Router();

router.post("/", passportCall("jwt"), checkRole(["user"]), cartController.createOrAddProductToCart);
router.post("/:cid/product/:pid/decrement", passportCall("jwt"), checkRole(["user"]), cartController.decrementProduct);
router.post("/:cid/product/:pid/remove", passportCall("jwt"), checkRole(["user"]), cartController.removeProduct);
router.get("/:cid", passportCall("jwt"), checkRole(["user"]), cartController.getCartById);
router.post("/:cid/product/:pid", passportCall("jwt"), checkRole(["user"]), cartController.addProductToCart);
router.delete("/:cid/products/:pid", passportCall("jwt"), checkRole(["user"]), cartController.deleteProductFromCart);
router.put("/:cid", passportCall("jwt"), checkRole(["user"]), cartController.updateCartProducts);
router.put("/:cid/products/:pid", passportCall("jwt"), checkRole(["user"]), cartController.updateProductQuantity);
router.delete("/:cid", passportCall("jwt"), checkRole(["user"]), cartController.emptyCart);

export default router;
