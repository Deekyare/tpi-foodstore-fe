import type { Product } from "../types/product";
import type { Pedido } from "../types/pedido";
import type { Usuario } from "../types/usuario";
import type { Categoria } from "../types/categoria";

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
export async function getCategories(): Promise<Categoria[]> {
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

// Obtiene todos los pedidos de forma asíncrona usando fetch
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

// Obtiene todos los usuarios de forma asíncrona usando fetch
export async function getUsuarios(): Promise<Usuario[]> {
  try {
    const response = await fetch("/data/usuarios.json");
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return [];
  }
}
