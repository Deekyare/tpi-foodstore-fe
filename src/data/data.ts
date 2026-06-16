import type { Product } from "../types/product";
import type { ICategoria } from "../types/categoria";
import type { Pedido } from "../types/pedido";

// Obtiene todos los productos de forma asíncrona usando fetch
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch("/data/productos.json");
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
}

// Obtiene todas las categorías de forma asíncrona usando fetch
export async function getCategories(): Promise<ICategoria[]> {
  try {
    const response = await fetch("/data/categorias.json");
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return [];
  }
}

// Obtiene todas las categorías de forma asíncrona usando fetch
export async function getPedidos(): Promise<Pedido[]> {
  try {
    const response = await fetch("/data/pedidos.json");
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    return [];
  }
}
