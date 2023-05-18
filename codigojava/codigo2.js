let carrito = [];
let productos = [];

const productosContainer = document.getElementById("productos-container");
const carritoContainer = document.getElementById("carrito-container");
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");

document.addEventListener("DOMContentLoaded", () => {
  obtenerDatosArchivosJson();
  mostrarCarrito();
  finalizarCompra(); // Llamada a la función finalizarCompra()
});

function obtenerDatosArchivosJson() {
  const URLJSON = "https://6462f4954dca1a6613515962.mockapi.io/accesorios";
  fetch(URLJSON)
    .then((response) => response.json())
    .then((data) => {
      productos = data;
      mostrarProductos();
      asignarEventosAgregarCarrito(); // Asignar eventos después de mostrar los productos
    })
    .catch((error) => {
      console.error('Error al obtener los productos:', error);
    });
}

function productoEnCarrito(producto) {
  return carrito.some((item) => item.id === producto.id);
}

function mostrarProductos() {
  productosContainer.innerHTML = '<div class="producto imagenDeFondo"><div class="container"><div class="row">' + productos.map((producto) => {
    return `

                <div class="col-lg-3 col-md-3 col-sm-3 col-xs-6 col-xl-2 text-center pt-2">
                    <div class="card">
                        <img src="${producto.imagen}" class="card-img-top img-fluid p-2" alt="${producto.nombre}">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text">$${producto.precio}</p>
                            <button class="btn btn-success btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
                        </div>
                    </div>
                </div>
   `;
  }).join("") + '</div></div></div>';

  asignarEventosAgregarCarrito(); // Asignar eventos después de mostrar los productos
}


function asignarEventosAgregarCarrito() {
  const botonesAgregar = document.querySelectorAll('.btn-agregar');
  botonesAgregar.forEach((boton) => {
    boton.addEventListener('click', (event) => {
      if (!boton.disabled) { // Verificar si el botón está habilitado
        boton.disabled = true; // Deshabilitar el botón temporalmente
        const productoId = parseInt(boton.dataset.id);
        const producto = productos.find((prod) => prod.id === productoId);
        if (producto && !productoEnCarrito(producto)) {
          carrito.push(producto);
          localStorage.setItem("carrito", JSON.stringify(carrito));
          mostrarCarrito();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Producto agregado',
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'El producto ya está en el carrito',
            showConfirmButton: false,
            timer: 1500
          });
        }
        setTimeout(() => {
          boton.disabled = false; // Habilitar el botón después de un tiempo
        }, 1500);
      }
    });
  });
}


function mostrarCarrito() {
  const carritoItems = JSON.parse(localStorage.getItem("carrito"));
  if (carritoItems.length === 0) {
    carritoContainer.innerHTML = `<p>El carrito se vació correctamente</p>`;
    return;
  }

  carritoContainer.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Producto</th>
          <th scope="col">Precio</th>
          <th scope="col">Cantidad</th>
          <th scope="col">Total</th>
        </tr>
      </thead>
      <tbody>
        ${carritoItems
      .map(
        (item, index) => `
              <tr>
                <td>${item.nombre}</td>
                <td>${item.precio}</td>
                <td>
                <button onclick="decrementarCantidad(${item.id})">-</button>
                <span id="cantidad-${item.id}">${item.cantidad}</span>
                <button onclick="incrementarCantidad(${item.id})">+</button>
              </td>
                <td>${item.precio * item.cantidad}</td>
              </tr>
            `
      )
      .join("")}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3">Total</td>
          <td>${calcularTotal(carritoItems)}</td>
        </tr>
      </tfoot>
    </table>`;
}

function incrementarCantidad(id) {
  const carritoItems = JSON.parse(localStorage.getItem("carrito")) || [];
  const producto = carritoItems.find((item) => item.id === id);
  if (producto) {
    producto.cantidad++;
    localStorage.setItem("carrito", JSON.stringify(carritoItems));
    mostrarCarrito();
  }
}

function decrementarCantidad(id) {
  const carritoItems = JSON.parse(localStorage.getItem("carrito")) || [];
  const producto = carritoItems.find((item) => item.id === id);
  if (producto && producto.cantidad > 1) {
    producto.cantidad--;
    localStorage.setItem("carrito", JSON.stringify(carritoItems));
    mostrarCarrito();
  }
}


function calcularTotal(productos) {
  return productos.reduce(
    (total, producto) => total + producto.precio * producto.cantidad,
    0
  );
}

function agregarAlCarrito(event) {
  const productoId = parseInt(event.target.dataset.id);
  const producto = productos.find((prod) => prod.id === productoId);
  if (producto) {
    const productoEnCarrito = carrito.find((item) => item.id === productoId);
    if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
  }
}

document.getElementById("vaciar-carrito")
  .addEventListener("click", function () {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres vaciar el carrito?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Sí, vaciar carrito',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        carrito = [];
        localStorage.clear();
        mostrarCarrito();
        Swal.fire(
          'Carrito vaciado',
          'El carrito ha sido vaciado completamente',
          'success'
        )
      }
    })
  });

  function finalizarCompra() {
    const botonFinalizarCompra = document.getElementById("Finalizar-compra");
    botonFinalizarCompra.addEventListener("click", function () {
      Swal.fire({
        title: 'Gracias por preferirnos!',
        text: 'Continuaremos con tu pedido al WhatsApp',
        imageUrl: 'https://unsplash.it/400/200',
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Custom image',
      });
  
      const productosParaWsp = carrito.map(item => `${item.nombre} $${item.precio} (Cantidad: ${item.cantidad})`);
      const totalPedido = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
      const mensajeWsp = encodeURIComponent(`Mi carrito de compras: \n\n${productosParaWsp.join('\n')}\n\nTotal del pedido: $${totalPedido}`);
  
      setTimeout(function () {
        window.open(`https://api.whatsapp.com/send?phone=+5491131172985&text=${mensajeWsp}`);
      }, 3000);
    });
  }