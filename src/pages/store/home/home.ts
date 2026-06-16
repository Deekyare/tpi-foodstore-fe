import type { Product } from "../../../types/product";
import type { ICategoria } from "../../../types/categoria";
import { actualizarContadorCarrito } from "../../../utils/helpers";
import { navigate } from "../../../utils/navigate";
import { getCategories, getProducts } from "../../../data/data";
import {
  getProductsCatalog,
  saveProductsCatalog,
  getCategoriesCatalog,
  saveCategoriesCatalog,
} from "../../../utils/localStorage";

let allProducts: Product[] = [];
let productosActuales: Product[] = []; // Guarda los productos que se ven en pantalla en cada momento
let categories: ICategoria[] = [];
let categoriaActiva: string = "Todas las categorías"; // Guarda el nombre de la categoría o filtro activo

// Elementos del DOM necesarios
const contenedorProductos = document.getElementById(
  "contenedor-productos",
) as HTMLDivElement;
const contadorProductos = document.getElementById(
  "contador-productos",
) as HTMLSpanElement;
const nombreCat = document.querySelector(
  ".nombre-cat-mostrada",
) as HTMLSpanElement;
const selectOrdenamiento = document.getElementById(
  "orderBy",
) as HTMLSelectElement;
const inputBuscar = document.getElementById("buscar") as HTMLInputElement;
const menuCategorias = document.getElementById(
  "lista-categorias",
) as HTMLUListElement;

/* ----------------------------------------------------------------------------------------------- */
// MUESTRA DE PRODUCTOS
/* ----------------------------------------------------------------------------------------------- */
function cargarProductos(listaDeProductos: Product[]) {
  // Guardamos la lista que se va a mostrar en nuestra variable de estado actual
  productosActuales = [...listaDeProductos];

  // Actualizamos el contador de productos encontrados
  if (contadorProductos) {
    contadorProductos.textContent = `${listaDeProductos.length} productos`;
  }

  // Mostramos el nombre de la categoría actual al lado del contador
  if (nombreCat) {
    nombreCat.textContent = categoriaActiva;
  }

  // Limpiamos el contenedor para evitar duplicados de búsquedas previas
  contenedorProductos.innerHTML = "";

  // Dibujamos cada tarjeta en el grid
  listaDeProductos.forEach((producto) => {
    const article = document.createElement("article");
    article.classList.add("product-card");
    article.setAttribute("data-id", producto.id.toString());

    const categoriaNombre = producto.categoria
      ? producto.categoria.nombre
      : "Sin categoría";

    article.innerHTML = `
      <img src="${producto.imagen}" alt="Imagen de ${producto.nombre}" />
      <div class="info-producto">
        <p class="categoria-nombre">${categoriaNombre}</p>
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
      </div>`;

    // Creación del elemento de precio
    const precio = document.createElement("p");
    precio.classList.add("product-precio");
    precio.innerHTML = `<strong>$ ${producto.precio}</strong>`;

    // Creación del botón "detalle"
    const btnDetalle = document.createElement("button");
    btnDetalle.classList.add("product-card__button");
    btnDetalle.textContent = "Detalle";

    btnDetalle.addEventListener("click", () => {
      navigate(`../productDetail/productDetail.html?id=${producto.id}`);
    });

    // Contenedor de botones
    const contenedorBtns = document.createElement("div");
    contenedorBtns.classList.add("product-card__actions");
    contenedorBtns.appendChild(precio);
    contenedorBtns.appendChild(btnDetalle);

    // Adjuntamos las acciones a la tarjeta y la tarjeta al contenedor principal
    article.appendChild(contenedorBtns);
    contenedorProductos.appendChild(article);
  });

  // BÚSQUEDA SIN RESULTADOS
  if (listaDeProductos.length === 0) {
    const mensajeError = document.createElement("h2");
    mensajeError.classList.add("mensaje-error");
    mensajeError.textContent = "No hay productos en esta busqueda";
    contenedorProductos.appendChild(mensajeError);
  }
}

/* ----------------------------------------------------------------------------------------------- */
// SECCIÓN DE CATEGORÍAS (BARRA LATERAL)
/* ----------------------------------------------------------------------------------------------- */
const cargarCategorias = (categorias: ICategoria[]) => {
  // Opción para ver todas las categorías de golpe
  const liTodo = document.createElement("li");
  liTodo.innerHTML = `<a href="#">Ver todas</a>`;
  liTodo.addEventListener("click", () => {
    if (selectOrdenamiento) selectOrdenamiento.value = "default"; // Reseteamos el selector
    categoriaActiva = "Todas las categorías";
    cargarProductos(allProducts);
  });
  menuCategorias.appendChild(liTodo);

  // Recorrer cada categoría del JSON e inyectarla en la lista lateral
  categorias.forEach((categoria) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="#">${categoria.nombre}</a>`;

    li.addEventListener("click", () => {
      if (selectOrdenamiento) selectOrdenamiento.value = "default"; // Reseteamos el selector antes de filtrar
      categoriaActiva = categoria.nombre;

      const resultadoCategoria = allProducts.filter((producto) => {
        return (
          producto.categoria && producto.categoria.nombre === categoria.nombre
        );
      });

      cargarProductos(resultadoCategoria);
    });

    menuCategorias.appendChild(li);
  });
};

/* ----------------------------------------------------------------------------------------------- */
// LOGICA DE LA BARRA DE BÚSQUEDA
/* ----------------------------------------------------------------------------------------------- */
inputBuscar.addEventListener("input", (e) => {
  if (selectOrdenamiento) selectOrdenamiento.value = "default"; // Reseteamos el selector al escribir

  const busqueda = (e.target as HTMLInputElement).value.toLowerCase();
  categoriaActiva = busqueda
    ? `Búsqueda: "${busqueda}"`
    : "Todas las categorías";

  const resultado = allProducts.filter((producto) => {
    return producto.nombre.toLowerCase().includes(busqueda);
  });

  cargarProductos(resultado);
});

/* ----------------------------------------------------------------------------------------------- */
// LOGICA DEL SELECTOR DE ORDENAMIENTO
/* ----------------------------------------------------------------------------------------------- */
if (selectOrdenamiento) {
  selectOrdenamiento.addEventListener("change", () => {
    const opcionSeleccionada = selectOrdenamiento.value;

    // Si no hay productos renderizados o eligen la opción neutra, paramos la ejecución
    if (productosActuales.length === 0 || opcionSeleccionada === "default")
      return;

    // Evaluamos las opciones cargadas en tu HTML
    if (opcionSeleccionada === "nomb-asc") {
      // Ordenamiento alfabético A-Z
      productosActuales.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (opcionSeleccionada === "nomb-desc") {
      // Ordenamiento alfabético Z-A
      productosActuales.sort((a, b) => b.nombre.localeCompare(a.nombre));
    } else if (opcionSeleccionada === "prec-asc") {
      // Ordenamiento numérico: de menor precio a mayor precio
      productosActuales.sort((a, b) => a.precio - b.precio);
    } else if (opcionSeleccionada === "prec-desc") {
      // Ordenamiento numérico: de mayor precio a menor precio
      productosActuales.sort((a, b) => b.precio - a.precio);
    }

    // Volvemos a mostrar las tarjetas en la pantalla usando la lista ya ordenada
    cargarProductos(productosActuales);
  });
}

/* ----------------------------------------------------------------------------------------------- */
// INICIALIZACIÓN DE LA APLICACIÓN
/* ----------------------------------------------------------------------------------------------- */
async function inicializarApp() {
  allProducts = getProductsCatalog();
  categories = getCategoriesCatalog();

  if (allProducts.length === 0) {
    allProducts = await getProducts();
    saveProductsCatalog(allProducts);
  }
  if (categories.length === 0) {
    categories = await getCategories();
    saveCategoriesCatalog(categories);
  }

  cargarCategorias(categories);
  cargarProductos(allProducts); // La app arranca listando todo el menú
}

inicializarApp();
actualizarContadorCarrito();
