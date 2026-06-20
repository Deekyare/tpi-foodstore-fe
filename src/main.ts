import type { Usuario } from "./types/usuario";
import { getUSer } from "./utils/localStorage";

window.onload = () => {
  console.log("cargando...");
  // Obtener ruta actual.
  const path = window.location.pathname.toLowerCase();
  // Obtener rol del usuario actual
  const userString = getUSer();
  const user = userString ? (JSON.parse(userString) as Usuario) : null;

  // Si no hay usuario y está intentando acceder a una zona protegida, redirigir al login
  if (!user) {
    if (path.includes("/admin/") || path.includes("/client/")) {
      console.log("redirigiendo al usuario al login");
      alert("Usuario invalido, por favor inicia sesion");
      window.location.href = "/src/pages/auth/login/login.html";
    }
    return; // Permitir el acceso si es una página pública
  }

  console.log({ user });

  // --- Protege la zona admin ---
  if (user.rol !== "ADMIN" && path.includes("/admin/")) {
    if (user.rol === "USUARIO") {
      console.log("Redirigiendo al cliente a su home");
      alert("No tienes permisos para acceder a esta página.");
      window.location.href =
        "/src/pages/store/home/home.html?error=incorrect_role";
    } else {
      console.log("redirigiendo al usuario al login");
      alert("Usuario invalido");
      window.location.href = "/src/pages/auth/login/login.html";
    }
    return;
  }

  // --- Protege la zona cliente ---
  if (user.rol !== "USUARIO" && path.includes("/client/")) {
    alert("No tienes permisos para acceder a esta página.");
    if (user.rol === "ADMIN") {
      console.log("redirigiendo al admin a su home");
      window.location.href =
        "/src/pages/admin/adminHome/adminHome.html?error=incorrect_role";
    } else {
      console.log("Redirigiendo al usuario al login");
      window.location.href = "/src/pages/auth/login/login.html";
    }
    return;
  }
};
