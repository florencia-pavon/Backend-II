import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import viewsRouter from './routes/views.js';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import ProductModel from './models/product.model.js';
import Handlebars from 'handlebars';
import passport from 'passport';
import './config/passport.config.js';
import cookieParser from 'cookie-parser';
import sessionsRouter from './routes/sessions.js';
import usersRouter from './routes/users.js';
import accountsRouter from './routes/accounts.js';


// Configuración de entorno
dotenv.config();

// Configuración de rutas absolutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicialización
const app = express();
const PORT = 8080;

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error conectando a MongoDB:', err));


// Configuración de Handlebars
Handlebars.registerHelper('multiply', (a, b) => a * b);

Handlebars.registerHelper('calculateTotal', (products) => {
  let total = 0;
  for (const item of products) {
    total += item.product.price * item.quantity;
  }
  return total.toFixed(2);
});
app.engine('handlebars', engine({
  handlebars: Handlebars,
  layoutsDir: path.join(__dirname, 'views/layouts'),
  defaultLayout: 'main',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(passport.initialize());

// Rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);
app.use('/', accountsRouter);

// Servidor HTTP y WebSocket
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const io = new Server(httpServer);
app.locals.io = io;

// WebSocket para productos en tiempo real
io.on('connection', socket => {
  console.log('Cliente conectado vía WebSocket');

  socket.on('nuevoProducto', async data => {
    try {
      await ProductModel.create(data);
      const productos = await ProductModel.find();
      io.emit('productosActualizados', productos);
    } catch (error) {
      console.error('Error al agregar producto por WebSocket:', error.message);
    }
  });
});
