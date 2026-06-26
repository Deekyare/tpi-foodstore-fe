import { type CartItem } from "../../../types/product";
import { type Pedido } from "../../../types/pedido";
import {
  actualizarContadorCarrito,
  cerrarSesion,
} from "../../../utils/helpers";
import {
  clearCart,
  getCart,
  saveCart,
  getOrders,
  saveOrders,
  getCurrentUser,
  saveUser,
} from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";

// Seleccionamos el elemento del DOM, donde se insertaran los productos que estan en el local storage.
const contenedorCompra = document.getElementById(
  "contenedor__productos",
) as HTMLDivElement;

// Inicializacion del monto en 0.
let costoTotal = 0;
const envio = 500;

// Se obtienen los datos.
const productosEnCarrito: CartItem[] = getCart();

const subtotalElement = document.getElementById(
  "resumen-subtotal",
) as HTMLElement;
const cajaMonto = document.getElementById("resumen-total") as HTMLElement;

// Elementos del Modal de Checkout
const modalCheckout = document.getElementById(
  "modal-checkout",
) as HTMLDivElement;
const btnCerrarCheckout = document.getElementById(
  "btn-cerrar-checkout",
) as HTMLButtonElement;
const formCheckout = document.getElementById(
  "form-checkout",
) as HTMLFormElement;
const inputNombre = document.getElementById(
  "checkout-nombre",
) as HTMLInputElement;
const inputApellido = document.getElementById(
  "checkout-apellido",
) as HTMLInputElement;
const inputTelefono = document.getElementById(
  "checkout-telefono",
) as HTMLInputElement;
const inputDireccion = document.getElementById(
  "checkout-direccion",
) as HTMLInputElement;
const selectPago = document.getElementById(
  "checkout-pago",
) as HTMLSelectElement;
const textareaNotas = document.getElementById(
  "checkout-notas",
) as HTMLTextAreaElement;

//------------------------------------------------------------------------------------------------
// BOTON "FINALIZAR COMPRA" & MODAL
//------------------------------------------------------------------------------------------------
const btnFinalizar = document.querySelector(
  ".btn--finalizar",
) as HTMLButtonElement;
const aviso = document.getElementById("mensaje-procesando") as HTMLDivElement;

btnFinalizar?.addEventListener("click", () => {
  const user = getCurrentUser();
  if (!user) {
    alert("Inicia sesión para realizar un pedido.");
    navigate("/src/pages/auth/login/login.html");
    return;
  }

  const productosActuales = getCart();
  if (productosActuales.length === 0) return;

  // Pre-cargar nombre si el usuario está logueado
  if (inputNombre) {
    inputNombre.value = `${user.nombre}`;
  }
  if (inputApellido) {
    inputApellido.value = `${user.apellido}`;
  }

  // Pre-cargar celular si el usuario lo tiene guardado
  if (inputTelefono && user.celular) {
    inputTelefono.value = user.celular;
  }

  // Mostrar el modal
  if (modalCheckout) {
    modalCheckout.classList.remove("hidden");
  }
});

if (btnCerrarCheckout) {
  btnCerrarCheckout.addEventListener("click", () => {
    if (modalCheckout) modalCheckout.classList.add("hidden");
  });
}

if (modalCheckout) {
  modalCheckout.addEventListener("click", (e) => {
    if (e.target === modalCheckout) {
      modalCheckout.classList.add("hidden");
    }
  });
}

formCheckout?.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = getCurrentUser();
  if (!user) {
    alert("Usuario no autenticado.");
    return;
  }

  const productosActuales = getCart();
  if (productosActuales.length === 0) return;

  const nombre = inputNombre ? inputNombre.value.trim() : user.nombre;
  const apellido = inputApellido ? inputApellido.value.trim() : user.apellido;
  const celu = inputTelefono.value.trim();
  const direccion = inputDireccion.value.trim();
  const metodoPago = selectPago.value;
  const notas = textareaNotas ? textareaNotas.value.trim() : "";

  // Armamos el paquete del pedido con el formato correcto
  const nuevoPedido: Pedido = {
    id: Date.now(),
    fecha: new Date().toISOString().split("T")[0],
    estado: "PENDIENTE",
    total: costoTotal + envio,
    // revisar
    formaPago: metodoPago as Pedido["formaPago"],
    detalles: productosActuales.map((item) => ({
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
      id: user.id,
      nombre: nombre,
      apellido: apellido,
      mail: user.mail,
      celular: celu,
      rol: user.rol,
    },
    direccion: direccion,
    notas: notas || undefined,
  };

  // Lo guardamos en la lista de pedidos
  const pedidos = getOrders();
  pedidos.push(nuevoPedido);
  saveOrders(pedidos);

  // Actualizamos el celular en los datos del usuario si no lo tenía
  if (!user.celular) {
    user.celular = celu;
    saveUser(user);
  }

  // Limpiamos el carrito
  clearCart();

  // Cerramos el modal
  if (modalCheckout) {
    modalCheckout.classList.add("hidden");
  }

  // Mostrar mensaje de procesando
  if (aviso) {
    aviso.classList.remove("hidden");
  }

  // Deshabilitar botón
  btnFinalizar.disabled = true;

  // Redirigir después de 2 segundos
  setTimeout(() => {
    navigate("../../client/orders/orders.html");
  }, 2000);
});

// Funcion para visualizar los items (compras) que estan en local storage.
function cargarItems() {
  contenedorCompra.innerHTML = "";
  costoTotal = 0;

  productosEnCarrito.forEach((producto) => {
    // Creamos el elemento article
    const article = document.createElement("article");
    article.classList.add("product-card");
    article.setAttribute("data-id", producto.id.toString());

    // Variable local para llevar la cuenta de la cantidad de un producto específico
    let cantidad: number = producto.cantidad || 1;
    // innerHTML para agregar los productos
    article.innerHTML = `
      <img src="${producto.imagen}" alt="Imagen de ${producto.nombre}" />
      <div class="product__detalle">
        <h3 class="detalle-renglon">${producto.nombre}</h3>
        <p class="detalle-renglon">Precio unitario: <strong>$ ${producto.precio}</strong></p>
        <p class="detalle-renglon" style="font-size: 0.95rem; color: var(--color-gris);">
          Subtotal: <strong class="item-subtotal-val">$ ${(producto.precio * cantidad).toFixed(2)}</strong>
        </p>
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
    const spanItemSubtotal = article.querySelector(
      ".item-subtotal-val",
    ) as HTMLSpanElement;

    // Lógica para sumar
    btnSumar.addEventListener("click", () => {
      if (cantidad < producto.stock) {
        cantidad++;
        spanCantidad.textContent = cantidad.toString();
        if (spanItemSubtotal) {
          spanItemSubtotal.textContent = `$ ${(producto.precio * cantidad).toFixed(2)}`;
        }
        costoTotal += producto.precio;
        mostrarTotal();
        actualizarCantidad(producto.id, cantidad);
      } else {
        alert(
          `No puedes agregar más unidades: el límite de stock de ${producto.nombre} es ${producto.stock}.`,
        );
      }
    });

    // Lógica para restar
    btnRestar.addEventListener("click", () => {
      if (cantidad > 1) {
        // Evita que baje de 1
        cantidad--;
        spanCantidad.textContent = cantidad.toString();
        if (spanItemSubtotal) {
          spanItemSubtotal.textContent = `$ ${(producto.precio * cantidad).toFixed(2)}`;
        }
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
      actualizarContadorCarrito();

      // Si después de borrar no quedan más artículos, mostramos el mensaje de vacío
      if (contenedorCompra.querySelectorAll("article").length === 0) {
        mostrarMensajeVacio();
      }
    });

    contenedorCompra.appendChild(article);
    costoTotal += producto.precio * cantidad;
  });

  const userName = document.querySelector(".user-name") as HTMLSpanElement;
  const user = getCurrentUser();
  if (user && userName) {
    userName.textContent = `${user.nombre} ${user.apellido}`;
  }

  // Controlar accesos de navegación según el rol
  const dashboardNav = document.querySelector(
    ".dashboard-nav",
  ) as HTMLElement | null;
  if (dashboardNav) {
    if (user && user.rol === "ADMIN") {
      dashboardNav.classList.remove("display"); // Mostrar a ADMIN
    } else {
      dashboardNav.classList.add("display"); // Ocultar a los demás
    }
  }

  const pedidosNav = document.querySelector(
    ".pedidos-nav",
  ) as HTMLElement | null;
  if (pedidosNav) {
    if (user && user.rol === "ADMIN") {
      pedidosNav.classList.add("display"); 
    } else {
      pedidosNav.classList.remove("display");
    }
  }

  const carritoNav = document.querySelector(".carrito-nav") as HTMLElement | null;
  if (carritoNav) {
    if (user && user.rol === "ADMIN") {
      carritoNav.classList.add("display"); // Ocultar carrito al administrador
    } else {
      carritoNav.classList.remove("display"); // Mostrar carrito a clientes y visitantes
    }
  }

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
    actualizarContadorCarrito();
  });
}

// Funcion que muestra e inserta el monto total.
function mostrarTotal() {
  if (subtotalElement) {
    subtotalElement.textContent = `$${costoTotal.toFixed(2)}`;
  }
  if (cajaMonto) {
    cajaMonto.textContent = `$${(costoTotal + (costoTotal > 0 ? envio : 0)).toFixed(2)}`;
  }
}

//Funcion para eliminar un producto entero del carrito a traves del boton ELIMINAR.
function eliminarItem(id: number) {
  const carritoActual: CartItem[] = getCart();

  // Filtramos a todos MENOS al que tenga el ID que pasaron
  const carritoActualizado = carritoActual.filter(
    (producto) => producto.id !== id,
  );
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
cerrarSesion();
