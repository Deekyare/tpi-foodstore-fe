import type { Product } from "./product";

export interface DetallePedido {
  cantidad: number;
  subtotal: number;
  producto: Product;
}

export interface UsuarioDto {
  id: number;
  nombre: string;
  apellido: string;
  mail: string;
  celular: string;
  rol: string;
}

export interface Pedido {
  id: number;
  fecha: string;
  estado: "PENDIENTE" | "EN_PREPARACION" | "ENTREGADO" | "CANCELADO";
  total: number;
  formaPago: "TARJETA" | "EFECTIVO" | "TRANSFERENCIA";
  detalles: DetallePedido[];
  usuarioDto: UsuarioDto;
  direccion?: string;
}
