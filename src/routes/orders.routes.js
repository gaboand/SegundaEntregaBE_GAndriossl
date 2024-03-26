import express from "express";
import {getOrders, getOrderById, createOrder, resolveOrder} from "../controllers/orders.controller.js";
const ordersRouter = express.Router();

ordersRouter.get("/", getOrders);
ordersRouter.get("/:id", getOrderById);
ordersRouter.post("/", createOrder);
ordersRouter.put("/:id", resolveOrder);

export default ordersRouter;