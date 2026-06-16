import type { CartItem, Product } from "../types/product";
import type { Pedido } from "../types/pedido";
import type { ICategoria } from "../types/categoria";

// --- CARRITO (CART) ---
// Usamos la clave "carrito" para evitar colisión con la lista global "productos"
export const saveCart = (carrito: CartItem[]) => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

export const getCart = (): CartItem[] => {
  const data = localStorage.getItem("carrito");
  return data ? JSON.parse(data) : [];
};

export const clearCart = () => {
  localStorage.removeItem("carrito");
};

// --- PEDIDOS (ORDERS) ---
export const saveOrders = (pedidos: Pedido[]) => {
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
};

export const getOrders = (): Pedido[] => {
  const data = localStorage.getItem("pedidos");
  return data ? JSON.parse(data) : [];
};

// --- PRODUCTOS (PRODUCTS CATALOG) ---
export const saveProductsCatalog = (productos: Product[]) => {
  localStorage.setItem("productos", JSON.stringify(productos));
};

export const getProductsCatalog = (): Product[] => {
  const data = localStorage.getItem("productos");
  return data ? JSON.parse(data) : [];
};

// --- CATEGORIAS (CATEGORIES CATALOG) ---
export const saveCategoriesCatalog = (categorias: ICategoria[]) => {
  localStorage.setItem("categorias", JSON.stringify(categorias));
};

export const getCategoriesCatalog = (): ICategoria[] => {
  const data = localStorage.getItem("categorias");
  return data ? JSON.parse(data) : [];
};
