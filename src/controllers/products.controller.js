import {productsDao} from "../dao/index.js"
import { PERSISTENCE } from "../config/config.js";

const getProducts = async (req, res) => {
    try {
        const { limit = 9, page = 1, sort, category } = req.query;
        const filter = {
            options: {
                limit,
                page,
            },
        };
        
        if (category) {
            filter.query = { category: category };
        }

        if (sort) {
            filter.options.sort = { price: sort };
        }
        const productsData = await productsDao.getPaginatedProducts(filter);

        const { docs } = productsData; 
        const products = docs;
        if (products.length < 1) {
            res.status(404).json({
                success: false,
                message: "Los productos no se pudieron recuperar",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getProductId = async (req, res) => {
    try {
        const { pid } = req.params;

        const product = await productsDao.getProductsById(pid);

        if (!product) {
            res.status(404).json({
                success: false,
                message: "Producto no encontrado",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const saveProducts = async (req, res) => {
    try {
        const productData = req.body;
        const newProduct = await productsDao.createProduct(productData);

        if (!newProduct) {
            res.status(400).json({
                success: false,
                message: "No se pudo crear el producto",
            });
            return;
        }

        const products = await productsDao.getProducts();
    
        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateProducts = async (req, res) => {
    try {
        const { pid } = req.params;
        const productData = req.body;

        const updatedProduct = await productsDao.updateProduct(pid, productData);

        if (!updatedProduct) {
            res.status(400).json({
                success: false,
                message: "No se pudo actualizar el producto",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: updatedProduct,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const deleteProducts = async (req, res) => {
    try {
        const { pid } = req.params;

        await productsDao.deleteProductById(pid);

        const products = await productsDao.getProducts();

        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export { getProducts, getProductId, saveProducts, updateProducts, deleteProducts };




