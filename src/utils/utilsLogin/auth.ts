import type { Rol } from "../../types/Rol";
import type { Usuario } from "../../types/usuario";
import { getUSer } from "../localStorage";
import { navigate } from "../navigate";

export const checkAuhtUser = (
  redireccion1: string,
  redireccion2: string,
  rol: Rol,
) => {
  console.log("comienzo de checkeo");

  const userString = getUSer();
  const currentPath = window.location.pathname.toLowerCase();

  if (!userString) {
    console.log("no existe en local", { userString });
    // Solo redirigimos si no estamos ya en la página de login
    if (!currentPath.includes("/auth/login/")) {
      navigate(redireccion1);
    }
    return;
  } else {
    const user: Usuario = JSON.parse(userString);
    if (user.rol !== rol) {
      console.log("existe pero no tiene el rol necesario", {
        userRol: user.rol,
        rol,
      });
      // Extraemos el path de destino sin los parámetros de búsqueda para comparar
      const targetPath = redireccion2.split("?")[0].toLowerCase();
      if (!currentPath.includes(targetPath)) {
        navigate(redireccion2);
      }
      return;
    }
  }
};
