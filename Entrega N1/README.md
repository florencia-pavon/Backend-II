# 🎂👩‍🍳 Lotta Pastelería – Auth & Roles 

E-commerce con **login/registro**, control de **roles (user/admin)**, **carrito por usuario** y vistas protegidas.

Flujo simple: te logueás, navegás el catálogo, agregás al carrito y finalizás la compra.

---

##  Qué puede hacer

- 🔐 **Ingresar y registrarse** con JWT en cookie (httpOnly) y redirección automática `?next=`.
- 🧑‍🍳 **Roles**: usuario compra; admin gestiona productos y usuarios.
- 🛒 **Carrito personal**: sumar, restar, eliminar ítems y finalizar compra.
- 👤 **Mi cuenta**: ver datos, editarlos, cambiar contraseña o eliminar cuenta.
- ⚡ **Tiempo real** (admin): alta de productos con Socket.io.
- 🛡️ **Rutas protegidas** con middlewares `requireAuth` y `checkRole`.

---

## 🖼️ Capturas
- Login
  
  <img width="486" height="723" alt="image" src="https://github.com/user-attachments/assets/fd1feb7d-19b8-4335-a3e7-0e9052375d62" />
  
- Register
  
  <img width="467" height="651" alt="image" src="https://github.com/user-attachments/assets/a1f48bf6-7500-495e-b320-2358b801dd6a" />
  
- Home
  
  <img width="492" height="725" alt="image" src="https://github.com/user-attachments/assets/2bcbc530-a321-4d1d-9eca-3ef750c4a3f6" />

- Account

  <img width="425" height="683" alt="image" src="https://github.com/user-attachments/assets/5441f5dc-68d7-4e6e-84ce-7aab7cf1c29b" />

- Checkout
  
  <img width="460" height="724" alt="image" src="https://github.com/user-attachments/assets/49aedd08-8e5f-4ce4-a975-e748c72fb6a9" />


- RealTimeProducts (admin)
 
  <img width="477" height="533" alt="image" src="https://github.com/user-attachments/assets/00f09dd8-7b67-4d40-96fc-b073a77ea07b" />



---

## 🔧 Tecnologías utilizadas

- ⚙️ Node.js
- 🚀 Express
- 🗄️ MongoDB Atlas + Mongoose
- 📄 Paginación (mongoose-paginate-v2)
- 🔑 Passport.js (local y jwt)
- 🧷 JWT (JSON Web Token)
- 🔐 Bcrypt
- 🧩 Handlebars + Bootstrap + Bootstrap Icons
- 🔌 WebSockets (Socket.io)
- 🧪 Dotenv
- 🍪 Cookie-parser

---

## ✨ Autora

Proyecto realizado por **Florencia Pavón**  
📧 [LinkedIn](https://www.linkedin.com/in/florencia-pavon/) • 💻 [GitHub](https://github.com/florencia-pavon)

Desarrollado como parte del curso de Backend II en **CoderHouse** 💻📚

