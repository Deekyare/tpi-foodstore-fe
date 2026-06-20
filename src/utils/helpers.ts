import { getCart, removeUser } from "./localStorage";
import { navigate } from "./navigate";

// Función para actualizar la burbuja roja del carrito en el header
export function actualizarContadorCarrito() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);
  const badge = document.querySelector("#cart-counter") as HTMLSpanElement;
  if (badge) {
    badge.textContent = totalItems.toString();
  }
}

export const logout = () => {
  removeUser();
  navigate("/src/pages/auth/login/login.html");
};

export const cerrarSesion = (): void => {
  const btnsCerrar = document.querySelectorAll(".btnCerrarSesion");

  btnsCerrar.forEach((btn) => {
    // Evitamos acumular eventos duplicados limpiando el listener antes 
    btn.removeEventListener("click", logout);
    btn.addEventListener("click", logout);
  });
};
