import { getCategories } from "../../../data/data"; // Importamos la función fetch del JSON
import type { Usuario } from "../../../types/usuario";
import type { Categoria } from "../../../types/categoria";
import { cerrarSesion } from "../../../utils/helpers";
import { getCategoriesCatalog, getUSer, saveCategoriesCatalog } from "../../../utils/localStorage";
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

let categorias: Categoria[] = [];

function cargarCategorias() {
  if (!contenedorLista) return;

  // Limpiamos el contenedor
  contenedorLista.innerHTML = "";

  // Recorremos e inyectamos las categorías
  categorias.forEach((categoria) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
    <td><strong>#${categoria.id}</strong></td>
    <td>${categoria.nombre}</td>
    <td>${categoria.descripcion}</td>
    <td class="campo-btns">
      <button class="btn-editar">✏️ Editar</button>
      <button class="btn-eliminar">🗑️ Eliminar</button>
    </td>
  `;
    contenedorLista.appendChild(fila);
  });
}

async function inicializarApp() {
  categorias = getCategoriesCatalog();
  if (categorias.length === 0) {
    categorias = await getCategories();
    saveCategoriesCatalog(categorias);
  }
  cargarCategorias();
}

inicializarApp();
cerrarSesion();