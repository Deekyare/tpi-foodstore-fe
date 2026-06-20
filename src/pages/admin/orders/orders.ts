import { getPedidos } from "../../../data/data";
import {
  actualizarContadorCarrito,
  cerrarSesion,
} from "../../../utils/helpers";
import type { Pedido } from "../../../types/pedido";
import { getOrders, getUSer, saveOrders } from "../../../utils/localStorage";
import type { Usuario } from "../../../types/usuario";
import { checkAuhtUser } from "../../../utils/utilsLogin/auth";

// Protegemos la página: solo ADMIN
checkAuhtUser(
  "/src/pages/auth/login/login.html",
  "/src/pages/store/home/home.html?error=incorrect_role",
  "ADMIN",
);

const userName = document.querySelector(".user-name") as HTMLSpanElement;
const userString = getUSer();
if (userString && userName) {
  const user = JSON.parse(userString) as Usuario;
  userName.textContent = `${user.nombre} ${user.apellido}`;
}

const contenedorPedidos = document.getElementById(
  "contenedor__pedidos",
) as HTMLDivElement;

let pedidos: Pedido[] = [];

function cargarPedidos() {
  if (!contenedorPedidos) return;

  // Limpiamos el contenedor
  contenedorPedidos.innerHTML = "";

  // Recorremos e inyectamos cada pedido
  pedidos.forEach((pedido) => {
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

    const article = document.createElement("article");
    article.classList.add("product-card");
    article.setAttribute("data-id", pedido.id.toString());

    article.innerHTML = `
      <div class="pedido-header">
        <span class="numero-pedido"><strong>Pedido #${pedido.id}</strong></span>
        <span class="orden-estado ${claseEstado}"><strong>${estadoTexto}</strong></span>
      </div>
      <div class="pedido-body">
        <p><strong>Cliente:</strong> ${pedido.usuarioDto.nombre} ${pedido.usuarioDto.apellido}</p>
        <p><strong>Fecha:</strong> ${pedido.fecha}</p>
      </div>
      <div class="contenedor-total">
        <span> &#128092; ${totalItems} ${totalItems === 1 ? "Producto" : "Productos"}</span>
        <span class="orden-total">Total: $${pedido.total.toFixed(2)}</span>
      </div>
      <div class="pedido-acciones">
        <label class="label-estado"><strong>Cambiar Estado:</strong></label>
        <select class="select-estado" data-id="${pedido.id}">
          <option value="PENDIENTE" ${pedido.estado === "PENDIENTE" ? "selected" : ""}>Pendiente</option>
          <option value="EN_PREPARACION" ${pedido.estado === "EN_PREPARACION" ? "selected" : ""}>En Preparación</option>
          <option value="ENTREGADO" ${pedido.estado === "ENTREGADO" ? "selected" : ""}>Completado</option>
          <option value="CANCELADO" ${pedido.estado === "CANCELADO" ? "selected" : ""}>Cancelado</option>
        </select>
      </div>
    `;
    // Cambiar el estado dinámicamente
    const selectEstado = article.querySelector(
      ".select-estado",
    ) as HTMLSelectElement;
    if (selectEstado) {
      selectEstado.addEventListener("change", (e) => {
        const target = e.target as HTMLSelectElement;
        const nuevoEstado = target.value as Pedido["estado"];

        // Actualizar el estado en el array de pedidos
        pedidos = pedidos.map((p) => {
          if (p.id === pedido.id) {
            return { ...p, estado: nuevoEstado };
          }
          return p;
        });
        // Guardar cambios en localStorage
        saveOrders(pedidos);
        // Cargar los pedidos para ver los cambios aplicados en pantalla
        cargarPedidos();
      });
    }
    contenedorPedidos.appendChild(article);
  });
}
async function inicializarApp() {
  pedidos = getOrders();
  if (pedidos.length === 0) {
    pedidos = await getPedidos();
    saveOrders(pedidos);
  }
  pedidos = pedidos.sort((a, b) => {
    const fechaA = new Date(a.fecha).getTime();
    const fechaB = new Date(b.fecha).getTime();
    return fechaB - fechaA;
  });
  cargarPedidos();
}

inicializarApp();
actualizarContadorCarrito();
cerrarSesion();
