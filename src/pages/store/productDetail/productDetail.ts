import { getProducts } from "../../../data/data";
import { type Product, type CartItem } from "../../../types/product";
import type { Usuario } from "../../../types/usuario";
import { actualizarContadorCarrito, cerrarSesion } from "../../../utils/helpers";
import { getCart, saveCart, getProductsCatalog, saveProductsCatalog, getUSer } from "../../../utils/localStorage";

// Obtener ID del producto desde los parámetros de la URL
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

let producto: Product;


// Seleccionar los elementos del DOM de esta pantalla
const btnRestar = document.querySelector(".btn--restar") as HTMLButtonElement;
const btnSumar = document.querySelector(".btn--sumar") as HTMLButtonElement;
const spanCantidad = document.querySelector(
  ".quantity-selector__txt",
) as HTMLSpanElement;
const btnAgregar = document.querySelector(".btn-naranja") as HTMLButtonElement;

// Inicializamos la cantidad
let cantidadSeleccionada: number = 1;

// Renderizar la información del producto de forma dinámica
function renderizarDetalleProducto() {
  const imgElement = document.getElementById("producto-imagen") as HTMLImageElement;
  const catElement = document.querySelector(".producto-categoria") as HTMLSpanElement;
  const tituloElement = document.querySelector(".producto-titulo") as HTMLHeadingElement;
  const precioElement = document.querySelector(".producto-precio") as HTMLDivElement;
  const stockElement = document.querySelector(".producto-stock") as HTMLSpanElement;
  const descripElement = document.querySelector(".producto-descripcion") as HTMLParagraphElement;

  const categoriaNombre =
    producto.categoria
      ? producto.categoria.nombre
      : "Sin categoría";

  // Al usar "as Type", TypeScript asume que el elemento no es nulo y podemos asignar propiedades directamente.
  imgElement.src = producto.imagen;
  imgElement.alt = `Imagen de ${producto.nombre}`;
  catElement.textContent = categoriaNombre;
  tituloElement.textContent = producto.nombre;
  precioElement.textContent = `$${producto.precio.toFixed(2)}`;
  
  stockElement.textContent = producto.disponible
    ? `Disponible (Stock: ${producto.stock})`
    : "Agotado / Sin Stock";
  stockElement.style.backgroundColor = producto.disponible ? "#00c98e" : "#e53e3e";
  
  descripElement.textContent = producto.descripcion;

  // Si no está disponible, deshabilitamos el botón de agregar
  if (btnAgregar && !producto.disponible) {
    btnAgregar.disabled = true;
    btnAgregar.style.backgroundColor = "#777";
    btnAgregar.style.cursor = "not-allowed";
    btnAgregar.textContent = "Sin Stock";
  }
}
// Lógica del contador de cantidad
btnSumar.addEventListener("click", () => {
  if (producto.disponible && cantidadSeleccionada < producto.stock) {
    cantidadSeleccionada++;
    spanCantidad.textContent = cantidadSeleccionada.toString();
  } else if (producto.disponible) {
    alert(`No puedes agregar más de ${producto.stock} unidades (límite de stock).`);
  }
});

btnRestar.addEventListener("click", () => {
  if (cantidadSeleccionada > 1) {
    cantidadSeleccionada--;
    spanCantidad.textContent = cantidadSeleccionada.toString();
  }
});

// Función para agregar el producto con la cantidad elegida al carrito
function agregarAlCarrito(productoClickeado: Product, cantidad: number) {
  const listaDeCompras: CartItem[] = getCart();

  // Buscar si el item específico ya está en la lista del carrito
  const productoExistente = listaDeCompras.find(
    (item) => item.id === productoClickeado.id,
  );

  if (productoExistente) {
    // Verificar que al sumar no superemos el stock disponible
    if (productoExistente.cantidad + cantidad <= productoClickeado.stock) {
      productoExistente.cantidad += cantidad;
    } else {
      alert(`No se pudo agregar: ya tienes ${productoExistente.cantidad} en tu carrito y el límite de stock es ${productoClickeado.stock}.`);
      return;
    }
  } else {
    const nuevoItemAlCarrito: CartItem = { ...productoClickeado, cantidad };
    listaDeCompras.push(nuevoItemAlCarrito);
  }

  // Guardamos el carrito actualizado en localStorage
  saveCart(listaDeCompras);
  alert(`Se agregó al carrito: ${productoClickeado.nombre} (Cantidad: ${cantidad})`);
  actualizarContadorCarrito();
}
const userName = document.querySelector(".user-name") as HTMLSpanElement;
const userString = getUSer();
if (userString && userName) {
  const user = JSON.parse(userString) as Usuario;
  userName.textContent = `${user.nombre} ${user.apellido}`;
}


// Inicializamos la pantalla al cargar la página
async function inicializarDetalle() {
  let allProducts = getProductsCatalog();
  if (allProducts.length === 0) {
    allProducts = await getProducts();
    saveProductsCatalog(allProducts);
  }
  producto = allProducts.find((p) => p.id === productId) || allProducts[0];

  renderizarDetalleProducto();
  actualizarContadorCarrito();

  // Lógica para agregar al carrito
  if (btnAgregar) {
    btnAgregar.addEventListener("click", () => {
      agregarAlCarrito(producto, cantidadSeleccionada);
    });
  }
}

inicializarDetalle();
cerrarSesion();