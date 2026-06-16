import { getCart } from "./localStorage";

// Función para actualizar la burbuja roja del carrito en el header
export function actualizarContadorCarrito() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);
  const badge = document.querySelector("#cart-counter") as HTMLSpanElement;
  if (badge) {
    badge.textContent = totalItems.toString();
  }
}