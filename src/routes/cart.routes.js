import express from "express";
import { saveCart, getCarts, getCartDetails, addProduct, deleteProduct, empty, deleteCart, updateQuantity, findById} from "../controllers/cart.controller.js";

const cartsRouter = express.Router();

cartsRouter.post("/", saveCart);
cartsRouter.get("/:cid", findById);
cartsRouter.get("/", getCarts);
cartsRouter.get("/:cid", getCartDetails);
cartsRouter.post("/:cid/product", addProduct);
cartsRouter.delete("/:cid/product/:productEntryId", deleteProduct);
cartsRouter.delete("/:cid/empty", empty);
cartsRouter.delete("/:cid", deleteCart)
cartsRouter.put("/:cid/product/:productId/quantity", updateQuantity);


export default cartsRouter;

