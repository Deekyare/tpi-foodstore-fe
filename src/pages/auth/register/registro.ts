import { getUsuarios } from "../../../data/data";
import type { Usuario } from "../../../types/usuario";
import {
  getUsersList,
  saveUsersList,
  saveUser,
} from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";

const form = document.getElementById("form") as HTMLFormElement;
const inputNombre = document.getElementById("nombre") as HTMLInputElement;
const inputApellido = document.getElementById("apellido") as HTMLInputElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;

form?.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();
  const valueNombre = inputNombre.value.trim();
  const valueApellido = inputApellido.value.trim();
  const valueEmail = inputEmail.value.trim();
  const valuePassword = inputPassword.value;

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(valueEmail)) {
    alert("Por favor, ingrese un email válido.");
    return;
  }

  // Validar largo de contraseña (mínimo 6 caracteres)
  if (valuePassword.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres.");
    return;
  }

  // Obtener los usuarios de localStorage
  const listaDeUsuarios = getUsersList();

  // Validar si el email ya existe
  if (listaDeUsuarios.some((u) => u.mail.toLowerCase() === valueEmail.toLowerCase())) {
    alert("El mail utilizado ya existe.");
    return;
  }

  // Crear el nuevo usuario
  const newUser: Usuario = {
    id: Date.now(),
    nombre: valueNombre,
    apellido: valueApellido,
    mail: valueEmail,
    celular: "",
    rol: "USUARIO",
    password: valuePassword,
    loggedIn: true, // Auto-login habilitado
  };

  // Guardar en la lista de usuarios
  listaDeUsuarios.push(newUser);
  saveUsersList(listaDeUsuarios);

  // Guardar usuario actual
  saveUser(newUser);

  console.log("Usuario registrado e ingresado con éxito:", newUser);

  // Redirigir directamente al home de la tienda
  navigate("/src/pages/store/home/home.html");
});

async function inicializarApp() {
  const listaDeUsuarios = getUsersList();
  if (listaDeUsuarios.length === 0) {
    const usuariosIniciales = await getUsuarios();
    saveUsersList(usuariosIniciales);
  }
}

inicializarApp();
