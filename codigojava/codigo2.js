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
                  <button onclick="decrementarCantidad(${index})">-</button>
                  <span id="cantidad-${index}">${item.cantidad}</span>
                  <button onclick="incrementarCantidad(${index})">+</button>
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

function incrementarCantidad(index) {
  const carritoItems = JSON.parse(localStorage.getItem("carrito")) || [];
  carritoItems[index].cantidad++;
  localStorage.setItem("carrito", JSON.stringify(carritoItems));
  mostrarCarrito();
}

function decrementarCantidad(index) {
  const carritoItems = JSON.parse(localStorage.getItem("carrito")) || [];
  if (carritoItems[index].cantidad > 1) {
    carritoItems[index].cantidad--;
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
    carrito.push(producto);
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
    const botonFinalizarCompra = document.getElementById("Finalizar-compra")
      .addEventListener("click", function () {
        Swal.fire({
          title: 'Gracias por preferirnos!',
          text: 'Continuaremos con tu pedido al WhatsApp',
          imageUrl: 'https://unsplash.it/400/200',
          imageWidth: 400,
          imageHeight: 200,
          imageAlt: 'Custom image',
        });
  
        let productosParaWsp = [];
        for (let i = 0; i < carrito.length; i++) {
          productosParaWsp.push(carrito[i].nombre + "$" + carrito[i].precio);
        }
        console.log(JSON.stringify(productosParaWsp));
  
        setTimeout(function() {
          window.open('https://api.whatsapp.com/send?phone=+5491131172985&text=Me%20interesan%20los%20siguientes%20productos' + ' ' + JSON.stringify(productosParaWsp)
          );
        }, 3000);
      });
  }
  
  finalizarCompra();