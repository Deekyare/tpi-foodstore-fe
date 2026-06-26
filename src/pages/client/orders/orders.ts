import {
  actualizarContadorCarrito,
  cerrarSesion,
} from "../../../utils/helpers";
import type { Pedido } from "../../../types/pedido";
import {
  getOrders,
  getCurrentUser,
  saveOrders,
} from "../../../utils/localStorage";
import { checkAuhtUser } from "../../../utils/utilsLogin/auth";
import { getPedidos } from "../../../data/data";

// Protegemos la página: solo CLIENTE/USUARIO
checkAuhtUser(
  "/src/pages/auth/login/login.html",
  "/src/pages/store/home/home.html?error=incorrect_role",
  "USUARIO",
);

const contenedorPedidos = document.getElementById(
  "contenedor__pedidos",
) as HTMLDivElement;

let pedidosOrdenados: Pedido[] = [];

function cargarPedidos() {
  // Limpiamos el contenedor por si acaso
  if (contenedorPedidos) {
    contenedorPedidos.innerHTML = "";
  } else {
    return;
  }

  pedidosOrdenados.forEach((pedido) => {
    // Determinamos la clase de color y texto según el estado
    let claseEstado = "orden-estado--pendiente";
    let estadoTexto = "Pendiente";

    if (pedido.estado === "EN_PREPARACION") {
      claseEstado = "orden-estado--proceso";
      estadoTexto = "En Preparación";
    } else if (pedido.estado === "ENTREGADO") {
      claseEstado = "orden-estado--completado";
      estadoTexto = "Completado";
    } else if (pedido.estado === "CANCELADO") {
      claseEstado = "orden-estado--cancelado";
      estadoTexto = "Cancelado";
    }

    const totalItems = (pedido.detalles || []).reduce(
      (sum, item) => sum + item.cantidad,
      0,
    );

    // Creamos el elemento article
    const article = document.createElement("article");
    article.classList.add("product-card");
    article.setAttribute("data-id", pedido.id.toString());
    article.innerHTML = `
        <div class="pedido-header">
          <span class="numero-pedido"><strong>Pedido #${pedido.id}</strong></span>
          <span class="orden-estado ${claseEstado}"><strong>${estadoTexto}</strong></span>
        </div>
        <div class="pedido-body">
          <p class="pedido-fecha">Fecha: ${pedido.fecha}</p>
          <ul class="pedidos-items">
            ${(pedido.detalles || [])
              .map(
                (detalle) => `
            <li>
              <span class="product-name">${detalle.producto.nombre} x ${detalle.cantidad}</span>
            </li>
            `,
              )
              .join("")}
          </ul>
        </div>
        <div class="contenedor-total">
        <span> &#128092; ${totalItems} ${totalItems === 1 ? "Producto" : "Productos"}</span>
        <p class="orden-total">Total: $${pedido.total.toFixed(2)}</p>
        </div>
      `;

    article.addEventListener("click", () => {
      abrirModalDetalle(pedido);
    });

    contenedorPedidos.appendChild(article);
  });
}
const userName = document.querySelector(".user-name") as HTMLSpanElement;
const user = getCurrentUser();
if (user && userName) {
  userName.textContent = `${user.nombre} ${user.apellido}`;
}

// La función recibe el objeto concreto del pedido
function abrirModalDetalle(pedido: Pedido) {
  const modal = document.getElementById("modal-pedido");
  const modalDireccion = document.getElementById("modal-cliente-direccion");
  const modalTelefono = document.getElementById("modal-cliente-telefono");
  const modalMetodoPago = document.getElementById("modal-metodo-pago");
  const modalSubtotal = document.getElementById("modal-subtotal");
  const modalEnvio = document.getElementById("modal-envio");
  const modalTotal = document.getElementById("modal-costo-total");
  const listaProductos = document.getElementById("modal-productos-lista");

  // Campos de estado dinámico
  const estadoContainer = document.getElementById(
    "modal-pedido-estado-container",
  );
  const estadoIcono = document.getElementById("modal-pedido-estado-icono");
  const estadoTexto = document.getElementById("modal-pedido-estado-texto");

  // Rellenar cabecera y estado
  const tituloModal = document.getElementById("modal-pedido-titulo");
  if (tituloModal) tituloModal.textContent = `Detalle del Pedido #${pedido.id}`;

  if (estadoContainer && estadoIcono && estadoTexto) {
    estadoContainer.className = "modal-pedido-card__estado";

    if (pedido.estado === "EN_PREPARACION") {
      estadoTexto.textContent = "Estado: En Preparación";
      estadoContainer.classList.add("estado--pendiente");
      estadoIcono.textContent = "⏳";
    } else if (pedido.estado === "ENTREGADO") {
      estadoTexto.textContent = "Estado: Completado";
      estadoContainer.classList.add("estado--entregado");
      estadoIcono.textContent = "✅";
    } else if (pedido.estado === "CANCELADO") {
      estadoTexto.textContent = "Estado: Cancelado";
      estadoContainer.style.backgroundColor = "#fdf2f2";
      estadoContainer.style.color = "#e53e3e";
      estadoIcono.textContent = "❌";
    } else {
      estadoTexto.textContent = "Estado: Pendiente";
      estadoContainer.classList.add("estado--pendiente");
      estadoIcono.textContent = "🔔";
    }
  }

  const subtotalCalc = (pedido.detalles || []).reduce(
    (sum, item) => sum + item.subtotal,
    0,
  );
  let envio = 500;

  if (modalDireccion)
    modalDireccion.textContent = pedido.direccion || "Privet Drive 4";
  if (modalTelefono)
    modalTelefono.textContent = pedido.usuarioDto?.celular || "Sin teléfono";
  if (modalMetodoPago)
    modalMetodoPago.textContent = pedido.formaPago || "Efectivo";
  if (modalSubtotal) modalSubtotal.textContent = `$${subtotalCalc.toFixed(2)}`;
  if (modalEnvio)
    modalEnvio.textContent = `$${envio >= 0 ? envio.toFixed(2) : "0.00"}`;
  if (modalTotal) modalTotal.textContent = `$${pedido.total.toFixed(2)}`;

  // Limpiamos la lista de productos viejos para que no se acumulen
  if (listaProductos) {
    listaProductos.innerHTML = "";

    // Recorremos los productos de ESTE pedido y creamos los <li>
    (pedido.detalles || []).forEach((detalle) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${detalle.producto.nombre} x ${detalle.cantidad}</span> <span>$${(detalle.producto.precio * detalle.cantidad).toFixed(2)}</span>`;
      listaProductos.appendChild(li);
    });
  }

  // Finalmente abrimos el modal
  if (modal) {
    modal.classList.remove("hidden");
  }
}

// Configuración para cerrar el modal
const btnCerrarModal = document.getElementById("btn-cerrar-modal");
const modalContainer = document.getElementById("modal-pedido");

if (btnCerrarModal) {
  btnCerrarModal.addEventListener("click", () => {
    if (modalContainer) modalContainer.classList.add("hidden");
  });
}

if (modalContainer) {
  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer) {
      modalContainer.classList.add("hidden");
    }
  });
}

async function inicializarApp() {
  let pedidos = getOrders();

  // Si no hay pedidos en localStorage, hacemos fetch de pedidos.json y los guardamos
  if (pedidos.length === 0) {
    const pedidosIniciales = await getPedidos();
    saveOrders(pedidosIniciales);
    pedidos = pedidosIniciales;
  }

  // Filtrar pedidos por el ID del usuario en sesión
  if (user) {
    const pedidosUsuario = pedidos.filter(
      (p) => p.usuarioDto && Number(p.usuarioDto.id) === Number(user.id),
    );

    // Ordenar pedidos del más nuevo al más viejo
    pedidosOrdenados = pedidosUsuario.sort((a, b) => {
      const fechaA = new Date(a.fecha).getTime();
      const fechaB = new Date(b.fecha).getTime();
      return fechaB - fechaA;
    });
  }

  cargarPedidos();
}

inicializarApp();
actualizarContadorCarrito();
cerrarSesion();
