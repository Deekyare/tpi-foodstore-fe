# Food Store - Evaluación 2

Proyecto **Food Store**, desarrollado como Trabajo Integrador Final para la materia Programación 3.

### Datos del Alumno

- **Alumna:** Giardini Silvia
- **Comisión:** 07
- **Materia:** Programación III
- **Carrera:** Tecnicatura Universitaria en Programación a Distancia
- **Link al video de YouTube:** https://youtu.be/xTfKCXWCAKM

## Descripción

La aplicación es un sistema web completo de tienda de alimentos que permite la gestión de pedidos tanto desde la perspectiva del cliente como del administrador. Cuenta con autenticación de usuarios, protección de rutas basadas en roles (`USUARIO` y `ADMIN`), catálogo dinámico de productos, carrito de compras interactivo y un panel de administración.

---

## Funcionalidades Implementadas

### Autenticación y Control de Accesos

- **Registro de Usuarios:** Formulario con validación de formato de email, longitud de contraseña (mínimo 6 caracteres), verificación de email único.
- **Inicio de Sesión:** Validación de credenciales.
- **Protección de Rutas:** Control de acceso según el rol (`ADMIN` / `USUARIO`) en base a la sesión activa. Redirección automática si se intenta acceder a una ruta sin autorización.
- **Persistencia:** Sesión de usuario persistente en `localStorage`.

### Módulo del Cliente (Tienda y Carrito)

- **Catálogo Dinámico:** Renderizado de productos desde una fuente de datos centralizada con filtrado por categorías y buscador por nombre.
- **Detalle del Producto:** Vista detallada de cada artículo (imagen, nombre, precio, descripción, stock, categoría y disponibilidad) con selector de cantidad interactivo que controla el stock.
- **Carrito Interactivo:**
  - Agregar/quitar productos (con límites basados en el stock disponible).
  - Cálculo de subtotal y total dinámicos.
  - Persistencia de los elementos del carrito.
  - Opción de vaciar carrito.
- **Checkout:** Modal de finalización de compra con campos para nombre, apellido, teléfono, dirección, método de pago y notas adicionales de preparación.

### Gestión de Pedidos del Cliente

- **Historial de Pedidos:** Listado de compras ordenado del más reciente al más antiguo.
- **Detalle del Pedido:** Modal interactivo que muestra los productos comprados, montos de subtotal, envío y total general, dirección de entrega, teléfono de contacto y estado del pedido.

### Panel de Administración

- **Dashboard Estadístico (Panel de Control):** Visualización interactiva de métricas clave calculadas dinámicamente:
  - Cantidad total de categorías.
  - Cantidad total de productos y cantidad de productos disponibles.
  - Cantidad total de pedidos.
  - Total de ingresos acumulados (suma del total de pedidos no cancelados).
  - Cantidad de pedidos según su estado actual (Pendiente, En Preparación, Entregado).
- **Gestión de Órdenes:** Lista global de pedidos realizados ordenada por fecha con cambio de estado interactivo (Pendiente, En Preparación, Completado, Cancelado) que se sincroniza inmediatamente con `localStorage`.
- **Gestión de Productos:** Listado de productos en formato de tabla para administración que muestra el ID, miniatura del producto, nombre, descripción, precio, categoría, stock y estado de actividad (Activo/Inactivo) con botones de edición y eliminación.
- **Gestión de Categorías:** Listado de categorías en formato de tabla para administración que muestra el ID, nombre y descripción, con botones de edición y eliminación.

---

## Tecnologías Utilizadas

- **HTML5 / CSS3** (Diseño responsivo y modal personalizado)
- **TypeScript / JavaScript** (Lógica de negocio tipada)
- **Vite** (Entorno de desarrollo rápido y empaquetador de producción)
- **Local Storage** (Base de datos local para persistencia de datos)

---

## Instalación y Ejecución

1. **Instalar dependencias**:
   Usar `pnpm` o `npm` para la gestión de paquetes:

   ```bash
   pnpm install
   # o
   npm install
   ```

2. **Ejecutar el servidor de desarrollo**:

   ```bash
   pnpm dev
   # o
   npm run dev
   ```

3. **Acceder a la aplicación**:
   Abre tu navegador en `http://localhost:5173`.

---
