import crypto from "crypto";
import fs from "fs";
import ProductsManager from "./productManager.js";
import path from "path";
import { fileURLToPath } from 'url';

const productsManager = new ProductsManager();

export default class CartsManager {
	#cartsFilePath;

    constructor(filePath = "../../cart.json") {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        this.#cartsFilePath = path.join(__dirname, filePath);
    }
    

	async createCart() {
    try {
        const newCart = {
            id: crypto.randomUUID(),
            products: [],
        };

        const carts = await this.getCarts();

        carts.push(newCart);

        this.#saveCarts(carts);
    } catch (error) {
        throw error;
    }
	}
	async getCarts() {
    try {
        if (fs.existsSync(this.#cartsFilePath)) {
            const data = await fs.promises.readFile(this.#cartsFilePath, "utf-8");
            const carts = JSON.parse(data);
            return Array.isArray(carts) ? carts : []
        }
        return [];
    } catch (error) {
        throw error;
    }
	}

	async getCartWithProductDetails(id) {
    try {
        const carts = await this.getCarts();
        const cart = carts.find((cart) => cart.id == id);

        if (!cart) {
            throw new Error(`Cart with id ${id} was not found.`);
        }

        cart.products = await Promise.all(
            cart.products.map(async (productData) => {
                return {
                    product: await productsManager.getProductsById(productData.product),
                    quantity: productData.quantity,
                };
            })
        );

        return cart;
    } catch (error) {
        throw error;
    }
}

	async addProductToCart(cid, pid) {
		try {
        const carts = await this.getCarts();

        const cart = carts.find((cart) => cart.id == cid);
        if (!cart) {
            throw new Error(`Cart with id ${cid} was not found.`);
        }

        const productInCart = cart.products.find((productData) => productData.product == pid);
        if (productInCart) {
            productInCart.quantity++;
        } else {
            cart.products.push({
                product: pid,
                quantity: 1,
            });
        }

        await this.#saveCarts(carts);

        return cart;
    } catch (error) {
        console.log(error);
        throw error;
		}
	}

	async #saveCarts(carts) {
		try {
		await fs.promises.writeFile(this.#cartsFilePath, JSON.stringify(carts));
		} catch (error) {
		throw error;
		}
	}

    async deleteCartById(id) {
        try {
            const carts = await this.getCarts();
            const cartIndex = carts.findIndex((cart) => cart.id == id);
            if (cartIndex >= 0) {
                carts.splice(cartIndex, 1);
            } else {
                return null;
            }
            this.#saveCarts(carts);
            return carts;
        } catch (error) {
            throw error;
        }
    }

    async deleteProductFromCart(cid, pid) {
        try {
            const carts = await this.getCarts();
            const cartIndex = carts.findIndex((cart) => cart.id == cid);
            if (cartIndex >= 0) {
                const productIndex = carts[cartIndex].products.findIndex((productData) => productData.product == pid);
                if (productIndex >= 0) {
                    carts[cartIndex].products.splice(productIndex, 1);
                } else {
                    return null;
                }
            } else {
                return null;
            }
            this.#saveCarts(carts);
            return carts;
        } catch (error) {
            throw error;
        }
    }

    async updateProductQuantity(cid, pid, quantity) {
        try {
            const carts = await this.getCarts();
            const cartIndex = carts.findIndex((cart) => cart.id == cid);
            if (cartIndex >= 0) {
                const productIndex = carts[cartIndex].products.findIndex((productData) => productData.product == pid);
                if (productIndex >= 0) {
                    carts[cartIndex].products[productIndex].quantity = quantity;
                } else {
                    return null;
                }
            } else {
                return null;
            }
            this.#saveCarts(carts);
            return carts;
        } catch (error) {
            throw error;
        }
    }

    async emptyCart(cid) {
        try {
            const carts = await this.getCarts(); // Añade await aquí
            const cartIndex = carts.findIndex((cart) => cart.id == cid);
            if (cartIndex >= 0) {
                carts[cartIndex].products = [];
            } else {
                return null;
            }
            await this.#saveCarts(carts); // Asegúrate de esperar que esta operación termine también
            return carts;
        } catch (error) {
            throw error;
        }
    }


}