import { type CartItem } from "../../../types/product";
import { type Pedido } from "../../../types/pedido";
import { actualizarContadorCarrito } from "../../../utils/helpers";
import { clearCart, getCart, saveCart, getOrders, saveOrders } from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";

// Seleccionamos el elemento del DOM, donde se insertaran los productos que estan en el local storage.
const contenedorCompra = document.getElementById(
  "contenedor__productos",
) as HTMLDivElement;

// Inicializacion del monto en 0.
let costoTotal = 0;

// Se obtienen los datos.
const productosEnCarrito: CartItem[] = getCart();

const cajaMonto = document.querySelector(".resumen__total") as HTMLDivElement;

//------------------------------------------------------------------------------------------------
// BOTON "FINALIZAR COMPRA"
//------------------------------------------------------------------------------------------------

const btnFinalizar = document.querySelector(
  ".btn--finalizar",
) as HTMLButtonElement;
const aviso = document.getElementById("mensaje-procesando") as HTMLDivElement;
btnFinalizar.addEventListener("click", () => {
  // Recuperamos los productos actuales usando el helper getCart()
  const productosEnCarrito = getCart();
  const envio = 500;
  // Si el carrito está vacío, no hacemos nada
  if (productosEnCarrito.length === 0) return;

  // Armamos el paquete del pedido con el formato del json
  const nuevoPedido: Pedido = {
    id: Date.now(),
    fecha: new Date().toISOString().split("T")[0],
    estado: "PENDIENTE",
    total: costoTotal + envio,
    formaPago: "EFECTIVO",
    detalles: productosEnCarrito.map((item) => ({
      cantidad: item.cantidad,
      subtotal: item.precio * item.cantidad,
      producto: {
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        descripcion: item.descripcion,
        stock: item.stock,
        imagen: item.imagen,
        disponible: item.disponible,
        categoria: item.categoria,
      },
    })),
    usuarioDto: {
      id: 2,
      nombre: "Juan",
      apellido: "Pérez",
      mail: "cliente@mail.com",
      celular: "1198765432",
      rol: "USUARIO",
    },
    direccion: "Calle Falsa 123",
  };

  // Lo acumulamos en la lista global de pedidos del sistema
  const pedidos = getOrders();
  pedidos.push(nuevoPedido);
  saveOrders(pedidos);

  // Limpiamos el carrito usando clearCart()
  clearCart();
  if (aviso) {
    aviso.classList.remove("hidden"); // Hacemos aparecer el cartel
  }
  // Deshabilitamos el botón para que no vuelvan a cliquear mientras procesa
  btnFinalizar.disabled = true;

  // Corren los 2 segundos automáticos sin bloquear la pantalla
  setTimeout(() => {
    navigate("../../client/orders/orders.html");
  }, 2000);
});

// Funcion para visualizar los items (compras) que estan en local storage.
function cargarItems() {
  productosEnCarrito.forEach((producto) => {
    // Creamos el elemento article
    const article = document.createElement("article");
    article.classList.add("product-card");
    article.setAttribute("data-id", producto.id.toString());
    const categoriaNombre = producto.categoria
      ? producto.categoria.nombre
      : "Sin categoría";

    // Variable local para llevar la cuenta de la cantidad de un producto específico
    let cantidad: number = producto.cantidad || 1;
    // innerHTML para agregar los productos
    article.innerHTML = `
      <img src="${producto.imagen}" alt="Imagen de ${producto.nombre}" />
      <div class="product__detalle">
        <p>${categoriaNombre}</p>
        <h3>${producto.nombre}</h3>
        <p>Precio: <strong>$ ${producto.precio}</strong></p>
      </div>
      
      <!-- Nuevo componente contador -->
      <div class="quantity-selector">
        <button class="btn--restar">-</button>
        <span class="quantity-selector__txt">${cantidad}</span>
        <button class="btn--sumar">+</button>
        
      </div>
      <div>
        <button class="btn--eliminar"> Eliminar </button>
      </div>
    `;

    // Capturamos los elementos
    const btnRestar = article.querySelector(
      ".btn--restar",
    ) as HTMLButtonElement;
    const btnSumar = article.querySelector(".btn--sumar") as HTMLButtonElement;
    //spanCantidad es el numero "cantidad" que va cambiando
    const spanCantidad = article.querySelector(
      ".quantity-selector__txt",
    ) as HTMLSpanElement;
    //Seleccionamos el boton eliminar
    const btnEliminar = article.querySelector(
      ".btn--eliminar",
    ) as HTMLButtonElement;

    // Lógica para sumar
    btnSumar.addEventListener("click", () => {
      cantidad++;
      spanCantidad.textContent = cantidad.toString();
      costoTotal += producto.precio;
      mostrarTotal();
      actualizarCantidad(producto.id, cantidad);
    });

    // Lógica para restar
    btnRestar.addEventListener("click", () => {
      if (cantidad > 1) {
        // Evita que baje de 1
        cantidad--;
        spanCantidad.textContent = cantidad.toString();
        costoTotal -= producto.precio;
        mostrarTotal();

        actualizarCantidad(producto.id, cantidad);
      }
    });

    // Lógica para eliminar
    btnEliminar.addEventListener("click", () => {
      eliminarItem(producto.id);
      article.remove();
      costoTotal -= producto.precio * cantidad;
      mostrarTotal();

      // Si después de borrar no quedan más artículos, mostramos el mensaje de vacío
      if (contenedorCompra.querySelectorAll("article").length === 0) {
        mostrarMensajeVacio();
      }
    });

    contenedorCompra.appendChild(article);
    costoTotal = costoTotal + producto.precio * cantidad;
  });

  const mostrarMensajeVacio = () => {
    contenedorCompra.innerHTML = "";

    const divVacio = document.createElement("div");
    divVacio.classList.add("carrito-vacio-container");
    divVacio.innerHTML = `
    <img src="/assets/carrito-vacio.png" alt="Carrito vacío" class="carrito-vacio__img" />
    <h2 class="mensaje-vacio">Tu carrito está vacío</h2>
  `;
    contenedorCompra.appendChild(divVacio);
    const tarjetaResumen = document.querySelector(
      ".tarjeta-izq",
    ) as HTMLDivElement;
    tarjetaResumen?.classList.add("tarjeta-izq--ocultar");
  };

  // Verificación inicial al cargar
  if (productosEnCarrito.length === 0) {
    mostrarMensajeVacio();
  }

  const btnVaciar = document.querySelector(".btn--vaciar") as HTMLButtonElement;

  // Lógica para borrar todo el carrito
  btnVaciar.addEventListener("click", () => {
    clearCart();
    alert("El carrito quedó vacío");
    costoTotal = 0;
    mostrarTotal();
    mostrarMensajeVacio();
  });
}
// Funcion que muestra e inserta el monto total.
function mostrarTotal() {
  cajaMonto.innerHTML = `<strong>TOTAL: $ ${costoTotal}</strong>`;
}

//Funcion para eliminar un producto entero del carrito a traves del boton ELIMINAR.
function eliminarItem(id: number) {
  // Lee los productos existentes en LocalStorage
  const carritoActual: CartItem[] = getCart();

  // Filtramos a todos MENOS al que tenga el ID que pasaron
  const carritoActualizado = carritoActual.filter(
    (producto) => producto.id !== id,
  );

  // Sobrescribo el local storage
  saveCart(carritoActualizado);
  // Retorna la cantidad de productos que quedan
  return carritoActualizado.length;
}

//Funcion que actualiza al restar o sumar cantidades
function actualizarCantidad(id: number, nuevaCantidad: number) {
  //Traer los productos del localStorage
  const carritoActual: CartItem[] = getCart();
  // Modificar unicamente el producto elegido
  const carritoActualizado = carritoActual.map((producto) => {
    if (producto.id === id) {
      // Actualiza la cantidad actual
      return { ...producto, cantidad: nuevaCantidad };
    }
    return producto;
  });
  // Sobreescribe los datos nuevos en el local storage
  saveCart(carritoActualizado);
  actualizarContadorCarrito();
}
actualizarContadorCarrito();
cargarItems();
mostrarTotal();
