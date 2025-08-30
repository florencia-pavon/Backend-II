import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Handlebars from "handlebars";
import passport from "passport";
import cookieParser from "cookie-parser";
import "./config/passport.config.js";
import viewsRouter from "./routes/views.routes.js";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import sessionsRouter from "./routes/sessions.routes.js";
import usersRouter from "./routes/users.routes.js";
import accountsRouter from "./routes/accounts.routes.js";
import ProductModel from "./models/product.model.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch((err) => console.error("Error conectando a MongoDB:", err));

Handlebars.registerHelper("multiply", (a, b) => a * b);
Handlebars.registerHelper("eq", (a, b) => a === b);
Handlebars.registerHelper("calculateTotal", (products) => {
  let total = 0;
  for (const item of products) total += item.product.price * item.quantity;
  return total.toFixed(2);
});

app.engine(
  "handlebars",
  engine({
    handlebars: Handlebars,
    layoutsDir: path.join(__dirname, "views/layouts"),
    defaultLayout: "main",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true
    }
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(passport.initialize());

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);
app.use("/", accountsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const io = new Server(httpServer);
app.locals.io = io;

io.on("connection", (socket) => {
  socket.on("nuevoProducto", async (data) => {
    try {
      await ProductModel.create(data);
      const productos = await ProductModel.find();
      io.emit("productosActualizados", productos);
    } catch (error) {
      console.error("Error al agregar producto por WebSocket:", error.message);
    }
  });
});
