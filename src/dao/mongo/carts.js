import { CartModel } from "../mongo/models/carts.model.js"; 

export default class CartDB {
    async createCart(cart) {
        try{
            const newCart = new CartModel(cart);
            const cartCollection = await newCart.save();
        return cartCollection; 
    } catch (error) {
        throw error;
    }
};

    async getCarts() {
    try{
        const cart = await CartModel.find().lean();
        return cart;
    } catch (error) {
        throw error;
    }
    };
    
    async getCartWithProductDetails(cartId) {
        try {
            const cart = await CartModel.findById(cartId).populate({
                path: "products.productId",
                model: "products"
            }).lean();
    
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
            let total = 0;
            let totalProducts = 0;
    
            cart.products.forEach(product => {
                total += product.productId.price * product.quantity;
                totalProducts += product.quantity;
            });
    
            cart.total = total;
            cart.totalProducts = totalProducts;
    
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async addProductToCart(cid, productId, quantity) {
    try{
        const cart = await CartModel.findById(cid);
        const existingProductIndex = cart.products.findIndex(p => p.productId.equals(productId));
    
        if (existingProductIndex >= 0) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }
    
        const updatedCart = await cart.save();
        return updatedCart;
    } catch (error) {
        throw error;
    }
    }

    async deleteProductFromCart(cartId, productEntryId) {
        try {
            const cart = await CartModel.findById(cartId);
            const productIndex = cart.products.findIndex(p => p._id.equals(productEntryId));
            if (productIndex >= 0) {
                cart.products.splice(productIndex, 1);
            } else {
                return null; 
            }
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            throw error;
        }
    }
    
    async emptyCart(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            cart.products = [];
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            throw error;
        }
    }

    async deleteCartById(id) {
        try {
            const cart = await CartModel.findById(id);
            if (!cart) {
                return null;
            }
    
            const pruebaID = await CartModel.findByIdAndDelete(id);
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
    
            const productIndex = cart.products.findIndex(p => p.productId.equals(productId));
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = quantity;
            } else {
                throw new Error('Producto no encontrado en el carrito');
            }
    
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            throw error;
        }
    }
    
};