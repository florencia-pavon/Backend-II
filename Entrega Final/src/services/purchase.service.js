import cartRepository from "../repository/cart.repository.js";
import productRepository from "../repository/product.repository.js";
import mailService from "./mail.service.js";

const { APP_URL } = process.env;

const currency = (n) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 2 }).format(n);

const buildOrderHtml = ({ user, items, total, orderId }) => {
  const logoUrl = "https://raw.githubusercontent.com/florencia-pavon/Backend-II/main/Entrega%20Final/src/public/multimedia/logo.png";
  const rows = items
    .map(
      (it) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">${it.title}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${it.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${currency(it.price)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">${currency(it.subtotal)}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
        <div style="background-color: #f19d30; text-align: center; padding: 20px;">
          <img src="${logoUrl}" alt="Lotta Pastelería" style="max-width: 120px; margin-bottom: 10px;" />
        </div>
        <div style="padding: 30px; color: #333;">
          <h3 style="margin-top: 0;">¡Hola ${user.first_name}!</h3>
          <p>Confirmamos tu compra.</p>
          <p style="margin:0 0 10px;">Número de orden: <strong>${orderId}</strong></p>
          <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr>
                <th style="text-align:left; padding:8px 12px; border-bottom:2px solid #ddd;">Producto</th>
                <th style="text-align:center; padding:8px 12px; border-bottom:2px solid #ddd;">Cant.</th>
                <th style="text-align:right; padding:8px 12px; border-bottom:2px solid #ddd;">Precio</th>
                <th style="text-align:right; padding:8px 12px; border-bottom:2px solid #ddd;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
              <tr>
                <td colspan="3" style="padding:12px; text-align:right; font-weight:bold;">Total</td>
                <td style="padding:12px; text-align:right; font-weight:bold;">${currency(total)}</td>
              </tr>
            </tbody>
          </table>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}" style="background-color: #570606; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-size: 16px;">Volver a la tienda</a>
          </div>
          <p style="font-size: 14px; color: #666;">Si tenés dudas, respondé a este correo.</p>
        </div>
        <div style="background-color: #f19d30; text-align: center; padding: 15px; font-size: 13px; color: #555;">
          <p style="margin: 5px 0;">Gracias por confiar en <strong>Lotta Pastelería</strong></p>
          <p style="margin: 0;">Saludos, el equipo de Lotta.</p>
        </div>
      </div>
    </div>
  `;
};

const checkout = async (cartId, user) => {
  const cart = await cartRepository.findByIdPopulated(cartId);
  if (!cart || !cart.products?.length) return { ok: true };

  const items = cart.products.map((p) => ({
    id: String(p.product._id),
    title: p.product.title || p.product.name || "",
    price: Number(p.product.price) || 0,
    quantity: p.quantity,
    subtotal: (Number(p.product.price) || 0) * p.quantity
  }));

  const ids = items.map((i) => i.id);
  const products = await productRepository.findManyByIds(ids);
  const byId = new Map(products.map((p) => [String(p._id), p]));
  const outOfStock = [];
  for (const it of items) {
    const prod = byId.get(it.id);
    const available = prod?.stock ?? 0;
    if (available < it.quantity) outOfStock.push({ id: it.id, name: it.title, requested: it.quantity, available });
  }
  if (outOfStock.length) return { ok: false, outOfStock };

  const ops = items.map((it) => ({
    updateOne: { filter: { _id: it.id, stock: { $gte: it.quantity } }, update: { $inc: { stock: -it.quantity } } }
  }));
  const bulk = await productRepository.bulkWrite(ops);
  if (bulk?.modifiedCount !== items.length) return { ok: false, outOfStock: [] };

  await cartRepository.setProducts(cartId, []);

  const total = items.reduce((acc, it) => acc + it.subtotal, 0);
  const orderId = `ORD-${Date.now()}`;
  const html = buildOrderHtml({ user, items, total, orderId });

  await mailService.sendMail({
    to: user.email,
    subject: `Confirmación de compra ${orderId}`,
    html
  });

  return { ok: true, orderId, total };
};

export default { checkout };
