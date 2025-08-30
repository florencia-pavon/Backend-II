import { Router } from "express";
import { passportCall } from "../middlewares/passportCall.js";
import { checkRole } from "../middlewares/auth.js";
import usersController from "../controllers/user.controller.js";

const router = Router();

router.get("/", passportCall("jwt"), checkRole(["admin"]), usersController.getAll);
router.get("/:uid", passportCall("jwt"), checkRole(["admin"]), usersController.getById);
router.put("/:uid", passportCall("jwt"), checkRole(["admin"]), usersController.updateById);
router.delete("/:uid", passportCall("jwt"), checkRole(["admin"]), usersController.deleteById);

export default router;
