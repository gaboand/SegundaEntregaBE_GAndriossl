import mongoose from "mongoose";

const cartCollection = "carts";

const CartSchema = new mongoose.Schema({
    products: [{
        productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true},
        quantity: {type: Number, required: true, min: 1}             
    }],
},
{ timestamps: true, }
);

CartSchema.pre("find", function (next) {
    this.populate({
        path: "products.productId",
        model: "products"
    });
    next();
});

export const CartModel = mongoose.model(cartCollection, CartSchema);