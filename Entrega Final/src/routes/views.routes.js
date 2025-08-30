import { Router } from "express";
import { requireAuth, guestOnly, checkRole } from "../middlewares/auth.js";
import viewsController from "../controllers/view.controller.js";

const router = Router();

router.get("/", requireAuth, viewsController.home);
router.get("/realtimeproducts", requireAuth, checkRole(["admin"]), viewsController.realTimeProducts);
router.get("/products/:pid", requireAuth, viewsController.productDetail);
router.get("/carts/:cid", requireAuth, viewsController.cartDetail);
router.get("/checkout", requireAuth, viewsController.checkout);
router.post("/checkout/confirm", requireAuth, viewsController.checkoutConfirm);
router.get("/login", guestOnly, viewsController.login);
router.get("/register", guestOnly, viewsController.register);
router.get("/forgot-password", guestOnly, viewsController.forgotPassword);
router.get("/reset-password", guestOnly, viewsController.resetPasswordForm);

export default router;
