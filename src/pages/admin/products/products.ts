import { getProducts } from "../../../data/data"; // Importamos la función fetch del JSON
import { getProductsCatalog, saveProductsCatalog } from "../../../utils/localStorage";

// Seleccionamos el contenedor
const contenedorLista = document.getElementById(
  "contenedor-lista-categorias",
) as HTMLDivElement;

async function cargarProductos() {
  // Obtenemos los productos de localStorage usando el helper
  let productos = getProductsCatalog();

  // Si no hay productos en localStorage, traemos los del JSON y los guardamos
  if (productos.length === 0) {
    productos = await getProducts();
    saveProductsCatalog(productos);
  }

  if (!contenedorLista) return;

  // Limpiamos el contenedor
  contenedorLista.innerHTML = "";

  // Recorremos e inyectamos los productos
  productos.forEach((producto) => {
    const fila = document.createElement("tr");
    
    // Mostramos el estado como Activo/Inactivo
    const textoEstado = producto.disponible ? "Activo" : "Inactivo";
    const claseEstado = producto.disponible ? "estado--activo" : "estado--inactivo";

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

// Ejecutamos la carga inicial
cargarProductos();
