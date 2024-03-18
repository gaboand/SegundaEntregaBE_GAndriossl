import fs from "fs";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

export default class ProductsManager {
	#filePath;

	constructor(filePath = "../../products.json") {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        this.#filePath = path.join(__dirname, filePath);
    }

	allFieldsAreValid(product) {
		if (
			!product.title ||
			!product.description ||
			!product.price ||
			!product.code ||
			!product.stock 
		) {
			return false;
		}
		return true;
	}
	
	async getProducts() {
		try {
			if (fs.existsSync(this.#filePath)) {
				const products = JSON.parse(await fs.promises.readFile(this.#filePath, "utf-8"));
				return products;
			}
			return [];
		} catch (error) {
			throw error;
		}
	}

	async getPaginatedProducts(filter = {}) {
		try {
			if (fs.existsSync(this.#filePath)) {
				let products = JSON.parse(await fs.promises.readFile(this.#filePath, "utf-8"));
				return { products }; 
        }
        return { products: [] };
    } catch (error) {
        throw error;
    }
}

	async getProductsById(id) {
		try {
			const products = await this.getProducts();

			const product = products.find((product) => product.id == id);

			if (!product) {
				throw new Error(`Product with id ${id} was not found.`);
			}
			return product;
		} catch (error) {
			throw error;
		}
	}


	async deleteProductById(id) {
		try {
			const product = this.getProductsById(id);
			if (!product) {
				throw new Error(`Product with id ${id} was not found.`);
			}

			let products = await this.getProducts();
			products = products.filter((product) => product.id !== id);

			this.#saveProducts(products);
		} catch (error) {
			throw error;
		}
	}

	async updateProduct(id, productUpdates) {
		try {
			const products = await this.getProducts();

			const productIndex = await products.findIndex((product) => product.id === id);

			if (productIndex < 0) {
				throw new Error(`Product with id ${id} was not found.`);
			}

			if (productUpdates.hasOwnProperty(id) && productUpdates.id !== products[productIndex].id) {
				throw new Error(`Product's id can not be modified`);
			}

			products[productIndex] = {
				...products[productIndex],
				...productUpdates,
			};

			await this.#saveProducts(products);

			return products[productIndex];
		} catch (error) {
			throw error;
		}
	}

	async createProduct(product) {
		try {
			if (!this.allFieldsAreValid(product)) {
				throw new Error("Missing data.");
			}
		const products = await this.getProducts();

		if (products.find((existingProduct) => existingProduct.code === product.code)) {
			throw new Error(`Product with code ${product.code} already exists`);
		}

		product.id = crypto.randomUUID();

		products.push(product);

		await this.#saveProducts(products);
		return product;
		} catch (error) {
			throw error;
		}
	}


	async #saveProducts(products) {
		try {
			await fs.promises.writeFile(this.#filePath, JSON.stringify(products));
		} catch (error) {
			throw error;
		}
	}

}