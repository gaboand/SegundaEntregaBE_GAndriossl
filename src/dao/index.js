import ProductsManager from "./memory/productManager.js";
import CartsManager from "./memory/cartManager.js";
import ProductDB from "./mongo/products.js";
import CartDB from "./mongo/carts.js";
import config from "../config/config.js";

const percistenceDao = config.persistence;

export const productsDao = percistenceDao === "MONGO" ? new ProductDB() : new ProductsManager();
export const cartsDao = percistenceDao === "MONGO" ? new CartDB() : new CartsManager();