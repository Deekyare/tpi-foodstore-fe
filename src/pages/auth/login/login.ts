import { getUsuarios } from "../../../data/data";
import { saveUser, getUsersList, saveUsersList } from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";

const form = document.getElementById("form") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;

form?.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();
  const valueEmail = inputEmail.value.trim();
  const valuePassword = inputPassword.value;

  // Obtener los usuarios de localStorage
  const listaDeUsuarios = getUsersList();

  // Busca al usuario que coincida con el email Y la contraseña
  const usuarioEncontrado = listaDeUsuarios.find(
    (user) => user.mail === valueEmail && user.password === valuePassword,
  );

  if (usuarioEncontrado) {
    console.log("LOGIN EXITOSO", usuarioEncontrado);

    usuarioEncontrado.loggedIn = true;
    saveUser(usuarioEncontrado);

    if (usuarioEncontrado.rol === "ADMIN") {
      navigate("/src/pages/admin/adminHome/adminHome.html");
    } else {
      navigate("/src/pages/store/home/home.html");
    }
  } else {
    // Si no lo encuentra o la contraseña es incorrecta:
    alert("Usuario o contraseña incorrectos");
  }
});

async function inicializarApp() {
  const listaDeUsuarios = getUsersList();
  if (listaDeUsuarios.length === 0) {
    const usuariosIniciales = await getUsuarios();
    saveUsersList(usuariosIniciales);
  }
}

inicializarApp();

