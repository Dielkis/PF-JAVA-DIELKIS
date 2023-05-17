let carrito = [];
let productos = [];

const productosContainer = document.getElementById("productos-container");
const carritoContainer = document.getElementById("carrito-container");
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
document.addEventListener("DOMContentLoaded", obtenerDatosArchivosJson);

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



function mostrarProductos() {
  productosContainer.innerHTML = productos.map((producto) => {
    return `
    <div class="producto imagenDeFondo">
        <div class="container">
            <div class="row">
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
            </div>
        </div>
    </div>
   `;
  }).join("");

  asignarEventosAgregarCarrito(); // Asignar eventos después de mostrar los productos
}


function asignarEventosAgregarCarrito() {
  const botonesAgregar = document.querySelectorAll('.btn-agregar');
  botonesAgregar.forEach((boton) => {
    boton.addEventListener('click', (event) => {
      if (!boton.disabled) { // Verificar si el botón está habilitado
        boton.disabled = true; // Deshabilitar el botón temporalmente
        agregarAlCarrito(event);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Producto agregado',
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => {
          boton.disabled = false; // Habilitar el botón después de un tiempo
        }, 1500);
      }
    });
  });
}


function mostrarCarrito() {
  const carritoItems = JSON.parse(localStorage.getItem("carrito")) || [];

  if (carritoItems.length === 0) {
    carritoContainer.innerHTML = `<p>El carrito se vacio correctamente</p>`;
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
            (item) => `
    <tr>
      <th scope="row">${item.nombre}</th>
      <td>${item.precio}</td>
      <td>${item.cantidad}</td>
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
  </table>
  `;
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
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
  }
}

document
  .getElementById("vaciar-carrito")
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