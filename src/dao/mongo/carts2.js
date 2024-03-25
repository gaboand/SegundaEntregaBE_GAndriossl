import { CartModel } from "../mongo/models/carts.model.js"; 

export default class CartDB{

async getCarts() {
    try{
        const cart = await CartModel.find().lean();
        return cart;
    } catch (error) {
        throw error;
    }
}

async getCartById(id) {
    try{
        const cart = await CartModel.findById(id).lean();
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        return cart;
    } catch (error) {
        throw error;
    }
}

async createCart(cart) {
    try{
        const newCart = new CartModel(cart);
        const cartCollection = await newCart.save();
        return cartCollection;
    } catch (error) {
        throw error;
    }
}

async getCartWhitProductDetails(id) {
    try{
        const cart = await CartModel.findById(id).populate({
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

async updateProductQuantity(id, productId, quantity) {
    try{
        const cart = await CartModel.findById(id);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        const productIndex = cart.products.findIndex(product => product.productId.toString() === productId.toString());
        if (productIndex === -1) {
            throw new Error("Producto no encontrado");
        }
        cart.products[productIndex].quantity = quantity;
        await cart.save();
        return cart;
    } catch (error) {
        throw error;
    }
}

async addProductToCart(id, productId, quantity) {
    try{
        const cart = await CartModel.findById(id);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        const productIndex = cart.products.findIndex(product => product.productId.toString() === productId.toString());
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }
        await cart.save();
        return cart;
    } catch (error) {
        throw error;
    }
}

async deleteProductFromCart(id, productEntryId) {
    try{
        const cart = await CartModel.findById(id);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        const productIndex = cart.products.findIndex(product => product._id.toString() === productEntryId.toString());
        if (productIndex === -1) {
            throw new Error("Producto no encontrado");
        }
        cart.products.splice(productIndex, 1);
        await cart.save();
        return cart;
    } catch (error) {
        throw error;
    }
}

async emptyCart(id) {
    try{
        const cart = await CartModel.findById(id);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        cart.products = [];
        await cart.save();
        return cart;
    } catch (error) {
        throw error;
    }
}

async deleteCartById(id) {
    try{
        const cart = await CartModel.findByIdAndDelete(id);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        return cart;
    } catch (error) {
        throw error;
    }
}

}