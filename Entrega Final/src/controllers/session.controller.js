import sessionsService from "../services/session.service.js";
import { toCurrentUserDTO } from "../DTO/user.dto.js";

const register = async (req, res) => {
  const nextUrl = req.query.next || "/";
  const token = sessionsService.signUserToken(req.user);
  sessionsService.setAuthCookie(res, token);
  return res.redirect(nextUrl);
};

const login = async (req, res) => {
  const nextUrl = req.query.next || "/";
  const token = sessionsService.signUserToken(req.user);
  sessionsService.setAuthCookie(res, token);
  return res.redirect(nextUrl);
};

const current = async (req, res) => {
  const dto = toCurrentUserDTO(req.user);
  return res.json({ status: "success", payload: dto });
};

const logout = async (req, res) => {
  sessionsService.clearAuthCookie(res);
  return res.redirect("/login");
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  await sessionsService.sendResetEmail(email);
  return res.redirect("/forgot-password?sent=1");
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const result = await sessionsService.resetPasswordWithToken(token, password);
  if (result === "INVALID_TOKEN") return res.redirect("/reset-password?error=token");
  if (result === "SAME_PASSWORD") return res.redirect(`/reset-password?token=${encodeURIComponent(token)}&error=same`);
  return res.redirect("/login");
};

export default { register, login, current, logout, forgotPassword, resetPassword };
