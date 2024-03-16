import { ProductsModel } from "../mongo/models/products.model.js";

export default class ProductDB {
    async getProducts() { 
        try {
            const product = await ProductsModel.find().lean();
            return product;
        } catch (error) {
            throw error;
        }
    }

    async getPaginatedProducts(filter) {
        try {
            filter.options.lean = true;
            const product = await ProductsModel.paginate(filter.query, filter.options);
            return product;
        } catch (error) {
            throw error;
        }
    }
    async getProductsById(id) {
        try {
            const product = await ProductsModel.findById(id).lean();
            return product;
        } catch (error) {
            throw error;
        }
    }

    async createProduct(product) {
        try {
            const newProduct = new ProductsModel(product);
            const products = await newProduct.save();
            return products;
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(id, product) {
        try {
            console.log("Actualizando producto:", id, "con:", product);
            const result = await ProductsModel.updateOne({ _id: id }, product);
    
            if (result.nModified === 0) {
                console.log("El producto no se modificó.");
                return null; 
            }
    
            const updatedProduct = await ProductsModel.findById(id);
            return updatedProduct;
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    }
    
    async deleteProductById(id, productsUpdates) {
        try {
            const product = await ProductsModel.findByIdAndDelete(id);
            return product;
        } catch (error) {
            throw error;
        }
    }
}

