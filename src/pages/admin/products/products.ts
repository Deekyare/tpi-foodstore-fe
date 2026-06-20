import { getProducts } from "../../../data/data"; // Importamos la función fetch del JSON
import type { Usuario } from "../../../types/usuario";
import type { Product } from "../../../types/product";
import { cerrarSesion } from "../../../utils/helpers";
import {
  getProductsCatalog,
  getUSer,
  saveProductsCatalog,
} from "../../../utils/localStorage";
import { checkAuhtUser } from "../../../utils/utilsLogin/auth";

// Protegemos la página: solo ADMIN
checkAuhtUser(
  "/src/pages/auth/login/login.html",
  "/src/pages/store/home/home.html?error=incorrect_role",
  "ADMIN"
);

const userName = document.querySelector(".user-name") as HTMLSpanElement;
const userString = getUSer();
if (userString && userName) {
  const user = JSON.parse(userString) as Usuario;
  userName.textContent = `${user.nombre} ${user.apellido}`;
}

// Seleccionamos el contenedor
const contenedorLista = document.getElementById(
  "contenedor-lista-categorias",
) as HTMLDivElement;

let productos: Product[] = [];

function cargarProductos() {
  if (!contenedorLista) return;

  // Limpiamos el contenedor
  contenedorLista.innerHTML = "";

  // Recorremos e inyectamos los productos
  productos.forEach((producto) => {
    const fila = document.createElement("tr");

    // Mostramos el estado como Activo/Inactivo
    const textoEstado = producto.disponible ? "Activo" : "Inactivo";
    const claseEstado = producto.disponible
      ? "estado--activo"
      : "estado--inactivo";

    fila.innerHTML = `
    <td><strong>#${producto.id}</strong></td>
    <td><img src="${producto.imagen}" alt="${producto.nombre}" class="tabla-thumbnail" /></td>
    <td>${producto.nombre}</td>
    <td class="columna-descripcion">${producto.descripcion}</td>
    <td>$${producto.precio.toFixed(2)}</td>
    <td>${producto.categoria ? producto.categoria.nombre : "Sin categoría"}</td>
    <td>${producto.stock} u.</td>
    <td><span class="etiqueta-estado ${claseEstado}">${textoEstado}</span></td>
    <td class="campo-btns">
      <button class="btn-editar">✏️ Editar</button>
      <button class="btn-eliminar">🗑️ Eliminar</button>
    </td>
  `;
    contenedorLista.appendChild(fila);
  });
}

async function inicializarApp() {
  productos = getProductsCatalog();
  if (productos.length === 0) {
    productos = await getProducts();
    saveProductsCatalog(productos);
  }
  cargarProductos();
}

inicializarApp();
cerrarSesion();

