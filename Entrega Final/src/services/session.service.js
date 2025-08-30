import jwt from "jsonwebtoken";
import userRepository from "../repository/user.repository.js";
import mailService from "./mail.service.js";
import { createHash, isValidPassword } from "../utils/bcrypt.utils.js";

const { JWT_SECRET, NODE_ENV, APP_URL } = process.env;
const COOKIE_NAME = "jwtCookie";

const signUserToken = (user) =>
  jwt.sign(
    {
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

const setAuthCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24,
  });
};

const clearAuthCookie = (res) => {
  res.clearCookie(COOKIE_NAME);
};

const signResetToken = (user) =>
  jwt.sign(
    {
      sub: String(user._id),
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

const verifyResetToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

const sendResetEmail = async (email) => {
  const user = await userRepository.findByEmail(email);
  if (!user) return false;
  const token = signResetToken(user);
  const resetUrl = `${APP_URL}/reset-password?token=${encodeURIComponent(
    token
  )}`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background-color: #f19d30; text-align: center; padding: 20px;">
          <img src="https://raw.githubusercontent.com/florencia-pavon/Backend-II/main/Entrega%20N1/src/public/multimedia/logo.png" alt="Lotta Pastelería" style="max-width: 120px; margin-bottom: 10px;" />
        </div>

        <!-- Body -->
        <div style="padding: 30px; color: #333;">
          <h3 style="margin-top: 0;">¡Hola ${user.first_name}!</h3>
          <p>Recibimos una solicitud para restablecer tu contraseña. Si fuiste vos, podés hacerlo presionando el botón de abajo.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #570606; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-size: 16px;">
              Restablecer contraseña
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666;">Este enlace expirará en 1 hora. Si no solicitaste un restablecimiento, podés ignorar este correo y tu contraseña seguirá siendo la misma.</p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f19d30; text-align: center; padding: 15px; font-size: 13px; color: #555;">
          <p style="margin: 5px 0;">Gracias por confiar en <strong>Lotta Pastelería</strong></p>
          <p style="margin: 0;">Saludos, el equipo de Lotta.</p>
        </div>
      </div>
    </div>
  `;

  await mailService.sendMail({
    to: email,
    subject: "Restablecer contraseña",
    html
  });
  return true;
};

const resetPasswordWithToken = async (token, newPassword) => {
  const payload = verifyResetToken(token);
  if (!payload) return "INVALID_TOKEN";
  const user = await userRepository.findById(payload.sub);
  if (!user) return "INVALID_TOKEN";
  const same = isValidPassword(user, newPassword);
  if (same) return "SAME_PASSWORD";
  user.password = createHash(newPassword);
  await userRepository.save(user);
  return "OK";
};

export default {
  signUserToken,
  setAuthCookie,
  clearAuthCookie,
  sendResetEmail,
  resetPasswordWithToken,
};
