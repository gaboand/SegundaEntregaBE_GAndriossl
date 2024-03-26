import mongoose from "mongoose";

const orderCollection = "orders";

const orderSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  purchase_datetime: { type: Date, default: Date.now }, 
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" }, 
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  totalPrice: { type: Number, required: true },
  status: { type: String, required: true },
});

orderSchema.pre('save', async function (next) {
    if (!this.code) {
        this.code = (Math.random().toString(16) + '000000000').substr(2, 10).toUpperCase();
    }
    next();
});

const OrderModel = mongoose.model(orderCollection, orderSchema);

export default OrderModel;
