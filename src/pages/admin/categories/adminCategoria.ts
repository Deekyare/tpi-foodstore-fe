import { getCategories } from "../../../data/data"; // Importamos la función fetch del JSON
import { getCategoriesCatalog, saveCategoriesCatalog } from "../../../utils/localStorage";

// Seleccionamos el contenedor
const contenedorLista = document.getElementById(
  "contenedor-lista-categorias",
) as HTMLDivElement;

async function cargarCategorias() {
  // Obtenemos las categorías de localStorage usando el helper
  let categorias = getCategoriesCatalog();

  // Si no hay categorías en localStorage, las traemos del JSON y las guardamos
  if (categorias.length === 0) {
    categorias = await getCategories();
    saveCategoriesCatalog(categorias);
  }

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

// Ejecutamos la carga inicial
cargarCategorias();
