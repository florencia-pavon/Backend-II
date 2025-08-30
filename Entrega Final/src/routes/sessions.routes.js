import { Router } from "express";
import passport from "passport";
import sessionsController from "../controllers/session.controller.js";

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", { session: false, failureRedirect: "/register?error=1" }),
  sessionsController.register
);

router.post(
  "/login",
  passport.authenticate("login", { session: false, failureRedirect: "/login?error=1" }),
  sessionsController.login
);

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  sessionsController.current
);

router.post("/logout", sessionsController.logout);

router.post("/forgot-password", sessionsController.forgotPassword);
router.post("/reset-password", sessionsController.resetPassword);

export default router;
