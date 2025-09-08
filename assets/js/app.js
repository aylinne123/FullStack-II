// --- Carrusel (solo si existe en la página) ---
const myCarousel = document.querySelector('#carouselExampleAutoplay');
if (myCarousel) {
    new bootstrap.Carousel(myCarousel, {
        interval: 2000,
        ride: 'carousel'
    });
}

// --- Carrito de compras funcional ---

// Agregar producto al carrito desde productos.html
document.addEventListener('DOMContentLoaded', function() {
    // Botones de agregar al carrito
    document.querySelectorAll('.btn-agregar-carrito').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const card = btn.closest('.card');
            const titulo = card.querySelector('.card-title').textContent;
            const descripcion = card.querySelector('.card-text').textContent;
            const imagen = card.querySelector('img').getAttribute('src');
            const precio = parseFloat(btn.getAttribute('data-precio'));
            agregarAlCarrito({ titulo, descripcion, imagen, precio });
            btn.textContent = "Agregado!";
            setTimeout(() => { btn.innerHTML = '<i class="bi bi-cart-plus"></i> Añadir'; }, 1000);
        });
    });

    // Si estamos en carrito.html, mostrar el carrito
    if (window.location.pathname.includes('carrito.html')) {
        mostrarCarrito();
    }
});

// Función para agregar productos al carrito (localStorage)
function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    // Si ya existe, suma cantidad
    const idx = carrito.findIndex(p => p.titulo === producto.titulo);
    if (idx >= 0) {
        carrito[idx].cantidad += 1;
    } else {
        producto.cantidad = 1;
        carrito.push(producto);
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Mostrar productos en carrito.html
function mostrarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const lista = document.querySelector('.list-group.list-group-flush');
    if (!lista) return;
    lista.innerHTML = '';
    let subtotal = 0;

    carrito.forEach((producto, idx) => {
        subtotal += producto.precio * producto.cantidad;
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex align-items-center justify-content-between flex-wrap';
        li.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${producto.imagen}" width="50" height="50" class="rounded me-3" alt="${producto.titulo}">
                <div>
                    <h6 class="mb-1">${producto.titulo}</h6>
                    <small class="text-muted">${producto.descripcion}</small>
                </div>
            </div>
            <div class="d-flex align-items-center">
                <input type="number" class="form-control form-control-sm me-2 cantidad-carrito" value="${producto.cantidad}" min="1" style="width:70px;" data-idx="${idx}">
                <span class="me-3 fw-bold">$${producto.precio * producto.cantidad}</span>
                <button class="btn btn-danger btn-sm btn-eliminar" data-idx="${idx}"><i class="bi bi-trash"></i></button>
            </div>
        `;
        lista.appendChild(li);
    });

    // Actualizar resumen
    const subtotalSpan = document.querySelector('span[aria-label="subtotal"]');
    const envioSpan = document.querySelector('span[aria-label="envio"]');
    const totalSpan = document.querySelector('span[aria-label="total"]');
    const envio = carrito.length > 0 ? 50 : 0;
    if (subtotalSpan) subtotalSpan.textContent = `$${subtotal}`;
    if (envioSpan) envioSpan.textContent = `$${envio}`;
    if (totalSpan) totalSpan.textContent = `$${subtotal + envio}`;

    // Eliminar producto
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = this.getAttribute('data-idx');
            carrito.splice(idx, 1);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            mostrarCarrito();
        });
    });

    // Cambiar cantidad
    document.querySelectorAll('.cantidad-carrito').forEach(input => {
        input.addEventListener('change', function() {
            const idx = this.getAttribute('data-idx');
            carrito[idx].cantidad = parseInt(this.value) || 1;
            localStorage.setItem('carrito', JSON.stringify(carrito));
            mostrarCarrito();
        });
    });
}

