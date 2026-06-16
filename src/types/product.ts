import type { ICategoria } from "./categoria";

export interface Product {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  stock: number;
  imagen: string;
  disponible: boolean;
  categoria: ICategoria;
}

export interface CartItem extends Product {
  cantidad: number;
}
