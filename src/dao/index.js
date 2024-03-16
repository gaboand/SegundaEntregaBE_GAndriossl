import ProductsManager from "./memory/productManager.js";
import CartsManager from "./memory/cartManager.js";
import ProductDB from "./mongo/products.js";
import CartDB from "./mongo/carts.js";
import {PERSISTENCE} from "../config/config.js";

export const productsDao = PERSISTENCE === "MONGO" ? new ProductDB() : new ProductsManager();
export const cartsDao = PERSISTENCE === "MONGO" ? new CartDB() : new CartsManager();