import { getCategories, getProducts, getPedidos } from "../../../data/data";
import { navigate } from "../../../utils/navigate";
import {
  getOrders,
  saveOrders,
  getProductsCatalog,
  saveProductsCatalog,
  getCategoriesCatalog,
  saveCategoriesCatalog,
} from "../../../utils/localStorage";

async function inicializarDashboard() {
  // Intentamos leer datos de localStorage
  let categorias = getCategoriesCatalog();
  let productos = getProductsCatalog();
  let pedidos = getOrders();

  // Si no hay datos, hacemos fetch e inicializamos el localStorage
  if (categorias.length === 0) {
    categorias = await getCategories();
    saveCategoriesCatalog(categorias);
  }
  if (productos.length === 0) {
    productos = await getProducts();
    saveProductsCatalog(productos);
  }
  if (pedidos.length === 0) {
    pedidos = await getPedidos();
    saveOrders(pedidos);
  }

  // calculamos las estadísticas
  const cantCategorias = categorias.length;
  const cantProductos = productos.length;
  const cantPedidos = pedidos.length;
  const cantDisponibles = productos.filter(p => p.disponible).length;

  // Ingresos totales: suma de los totales de pedidos no cancelados
  const ingresosTotales = pedidos
    .filter(p => p.estado !== "CANCELADO")
    .reduce((sum, p) => sum + p.total, 0);

  const pedidosPendientes = pedidos.filter(p => p.estado === "PENDIENTE").length;
  const pedidosEnPreparacion = pedidos.filter(p => p.estado === "EN_PREPARACION").length;
  const pedidosCompletados = pedidos.filter(p => p.estado === "ENTREGADO").length;

  // Insertar en el DOM
  const elemCategorias = document.getElementById("cant-categorias");
  const elemProductos = document.getElementById("cant-productos");
  const elemPedidos = document.getElementById("cant-pedidos");
  const elemDisponibles = document.getElementById("cant-disponibles");

  const elemIngresos = document.getElementById("resumen-ingresos");
  const elemPendientes = document.getElementById("resumen-pendientes");
  const elemPreparacion = document.getElementById("resumen-preparacion");
  const elemCompletados = document.getElementById("resumen-completados");

  if (elemCategorias) elemCategorias.textContent = cantCategorias.toString();
  if (elemProductos) elemProductos.textContent = cantProductos.toString();
  if (elemPedidos) elemPedidos.textContent = cantPedidos.toString();
  if (elemDisponibles) elemDisponibles.textContent = cantDisponibles.toString();

  if (elemIngresos) elemIngresos.textContent = `$${ingresosTotales.toFixed(2)}`;
  if (elemPendientes) elemPendientes.textContent = pedidosPendientes.toString();
  if (elemPreparacion) elemPreparacion.textContent = pedidosEnPreparacion.toString();
  if (elemCompletados) elemCompletados.textContent = pedidosCompletados.toString();
}

// A traves de cada btn redireccionamos al usuario
const btnCategorias = document.getElementById("btn-gestion-categorias") as HTMLButtonElement;
const btnProductos = document.getElementById("btn-gestion-productos") as HTMLButtonElement;
const btnPedidos = document.getElementById("btn-gestion-pedidos") as HTMLButtonElement;

if (btnCategorias) {
  btnCategorias.addEventListener("click", () => navigate("../categories/adminCategoria.html"));
}

if (btnProductos) {
  btnProductos.addEventListener("click", () => navigate("../products/products.html"));
}

if (btnPedidos) {
  btnPedidos.addEventListener("click", () => navigate("../orders/orders.html"));
}

inicializarDashboard();