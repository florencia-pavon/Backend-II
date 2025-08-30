import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import accountController from "../controllers/account.controller.js";

const router = Router();

router.get("/account", requireAuth, accountController.getAccountView);
router.post("/account/update", requireAuth, accountController.updateAccount);
router.post("/account/delete", requireAuth, accountController.deleteAccount);

export default router;
