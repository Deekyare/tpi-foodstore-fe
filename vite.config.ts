import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        storeHome: resolve(__dirname, "src/pages/store/home/home.html"),
        storeCart: resolve(__dirname, "src/pages/store/cart/cart.html"),
        storeProductDetail: resolve(__dirname, "src/pages/store/productDetail/productDetail.html"),
        authLogin: resolve(__dirname, "src/pages/auth/login/login.html"),
        adminHome: resolve(__dirname, "src/pages/admin/adminHome/adminHome.html"),
        adminCategoria: resolve(__dirname, "src/pages/admin/categories/adminCategoria.html"),
        adminProducts: resolve(__dirname, "src/pages/admin/products/products.html"),
        adminOrders: resolve(__dirname, "src/pages/admin/orders/orders.html"),
        clientOrders: resolve(__dirname, "src/pages/client/orders/orders.html"),
      },
    },
  },
  base: "./",
});
