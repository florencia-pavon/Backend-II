# 🎂👩‍🍳 Lotta Pastelería

E-commerce con **login/registro**, control de **roles (user/admin)**, **carrito por usuario**, vistas protegidas y **mails transaccionales** (reset password y confirmación de compra).

Flujo simple: te logueás, navegás el catálogo, agregás al carrito, finalizás la compra y recibís un mail con el detalle de tu orden.

---

## ✨ Qué puede hacer

- 🔐 **Ingresar y registrarse** con JWT en cookie (httpOnly) y redirección automática `?next=`.
- 🧑‍🍳 **Roles**:  
  - Usuario: compra productos, administra su carrito y su cuenta.  
  - Admin: gestiona productos en tiempo real y usuarios.
- 🛒 **Carrito personal**: sumar, restar, eliminar ítems y finalizar compra.
- 💌 **Mails automáticos**:  
  - Reset password con enlace y expiración.  
  - Confirmación de compra con detalle de productos, cantidades y total.
- 👤 **Mi cuenta**: ver datos, editarlos, cambiar contraseña o eliminar cuenta.
- ⚡ **Tiempo real (admin)**: alta de productos con Socket.io.
- 🛡️ **Rutas protegidas** con middlewares `requireAuth`, `guestOnly` y `checkRole`.

---

## 🏗️ Arquitectura aplicada

El proyecto está desarrollado siguiendo buenas prácticas de **arquitectura en capas**, lo que facilita la mantenibilidad y escalabilidad:

- 📂 **Controllers**: reciben la petición y delegan la lógica.  
- ⚙️ **Services**: contienen la lógica de negocio.  
- 🗄️ **DAO (Data Access Object)**: capa de acceso a la base de datos con Mongoose.  
- 🔄 **Repository**: abstrae el acceso a los DAO y centraliza operaciones.  
- 📦 **DTO (Data Transfer Object)**: formateo y validación de datos entre capas.

Esta organización permite separar responsabilidades claramente y mantener un código limpio y reutilizable.

---

## 🖼️ Capturas

- Login  
  <img width="497" height="728" alt="image" src="https://github.com/user-attachments/assets/372934e7-02ed-4dcf-a586-c3ae4efb915e" />

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

- Mailing  
  <img width="490" height="530" alt="image" src="https://github.com/user-attachments/assets/bdcf0124-0742-42b5-9b0c-99556038f1bb" />
  <img width="490" height="530" alt="image" src="https://github.com/user-attachments/assets/e77c0ec7-8b18-4685-ae91-35a80d50de59" />




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
- 📧 Nodemailer
- 🧪 Dotenv
- 🍪 Cookie-parser

---

## 👩‍💻 Autora

Proyecto realizado por **Florencia Pavón**  
📧 [LinkedIn](https://www.linkedin.com/in/florencia-pavon/) • 💻 [GitHub](https://github.com/florencia-pavon)

Desarrollado como parte del curso de **Backend II** en CoderHouse 💻📚
