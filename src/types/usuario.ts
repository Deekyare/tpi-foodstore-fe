export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  mail: string;
  celular: string;
  rol: "ADMIN" | "USUARIO";
  password: string; 
}