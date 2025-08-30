const socket = io();
const form = document.getElementById('formularioProducto');
const lista = document.getElementById('lista-productos');

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(form);
  const nuevoProducto = {
    title: formData.get('title'),
    description: formData.get('description'),
    code: formData.get('code'),
    price: parseFloat(formData.get('price')),
    stock: parseInt(formData.get('stock')),
    category: formData.get('category'),
    thumbnails: [formData.get('thumbnail')]
  };

  socket.emit('nuevoProducto', nuevoProducto);
  form.reset();
});

socket.on('productosActualizados', productos => {
  lista.innerHTML = '';
  productos.forEach(p => {
    lista.innerHTML += `
      <div class="col-md-3 mb-4">
        <div class="card h-100 text-center">
          <img src="${p.thumbnails[0]}" class="card-img-top p-2" style="height:200px; object-fit:cover;" alt="${p.title}">
          <div class="card-body">
            <h5 class="card-title">${p.title}</h5>
          </div>
        </div>
      </div>`;
  });
});
