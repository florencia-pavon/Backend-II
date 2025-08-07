# 🛒 Entrega 1 - Backend II - Sistema de Autenticación y Autorización

Este proyecto es una extensión del ecommerce desarrollado en el curso de Backend I. En esta entrega se incorporó un sistema completo de autenticación y autorización utilizando **JWT** y **Passport**, junto con un **CRUD de usuarios** y la protección de rutas según el rol del usuario.

---

## 🔧 Tecnologías utilizadas

- Node.js
- Express
- MongoDB Atlas + Mongoose
- Passport.js (`local` y `jwt`)
- JWT (JSON Web Token)
- Bcrypt
- Handlebars
- WebSockets (Socket.io)
- Dotenv
- Cookie-Parser

---

## 👤 Modelo de Usuario

El modelo `User` contiene los siguientes campos:

- `first_name`: String
- `last_name`: String
- `email`: String (único)
- `age`: Number
- `password`: String (hasheado con bcrypt)
- `cart`: Referencia a modelo `Cart`
- `role`: String (default: `"user"`, puede ser `"admin"`)

---

## 🔐 Autenticación y Autorización

Se configuraron dos estrategias de Passport:

### 1. `local`  
Para validar credenciales en el login (`email` y `password`).

### 2. `jwt`  
Para proteger rutas usando un token JWT almacenado en una cookie segura (`jwtCookie`).

### Middleware:
- `passportCall('jwt')`: Verifica token JWT
- `checkRole(['admin'])`: Permite acceso solo a administradores
- `checkRole(['user'])`: Permite acceso a usuarios logueados

---

## 🧪 Rutas de sesión (`/api/sessions`)

- `POST /register`: Registro de usuario con contraseña encriptada
- `POST /login`: Login con generación de JWT en cookie
- `GET /current`: Devuelve los datos del usuario autenticado

---

## 👥 CRUD de Usuarios (`/api/users`)

**Protegido con rol `admin`.**

- `GET /`: Listar todos los usuarios
- `GET /:uid`: Obtener usuario por ID
- `PUT /:uid`: Actualizar usuario (por ejemplo, cambiar rol)
- `DELETE /:uid`: Eliminar usuario

---

## 🛍️ Productos (`/api/products`)

- `GET /`: Público
- `GET /:pid`: Público
- `POST /`: Solo `admin`
- `PUT /:pid`: Solo `admin`
- `DELETE /:pid`: Solo `admin`

---

## 🛒 Carritos (`/api/carts`)

**Protegido con rol `user`.**

- `POST /`: Crear carrito con producto
- `GET /:cid`: Obtener carrito
- `POST /:cid/product/:pid`: Agregar producto
- `PUT /:cid`: Reemplazar productos
- `PUT /:cid/products/:pid`: Cambiar cantidad
- `DELETE /:cid/products/:pid`: Eliminar producto
- `DELETE /:cid`: Vaciar carrito

---

