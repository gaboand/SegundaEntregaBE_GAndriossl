import { Router } from "express";
import CartDB from "../services/dbManager/cart.controller.js";
import ProductDB from "../services/dbManager/products.controller.js";
import MessageDB from "../services/dbManager/chat.controler.js";
import ProductsManager from "../services/fs/ProductManager.js";
import CartsManager from "../services/fs/CartManager.js";

const viewsRouter = Router();
const cartDB = new CartDB();
const productDB = new ProductDB();
const messageDB = new MessageDB();
const productManager = new ProductsManager("src/products.json");
const cartManager = new CartsManager("src/carts.json");

viewsRouter.get("/products", async (req, res) => {
    const { limit = 9, page = 1, sort, category } = req.query;

    const filter = {
        options: {
            lean: true,
            limit: parseInt(limit, 10),
            page: parseInt(page, 10),
            ...(sort && { sort: { price: sort === 'desc' ? -1 : 1 } }),
        },
        query: {
            ...(category && { category: category }),
        }
    };

    try {
        const products = await productDB.getPaginatedProducts(filter);
        res.render("products", {
            title: "Listado de productos",
            products: products,
            style: "css/products.css",
        });

    } catch (error) {
        res.status(500).send("Error al recuperar los productos");
    }
});

viewsRouter.get("/chat", async (req, res) => {
	const messages = await messageDB.findMessages();

	res.render("chat", {
		title: "Chat",
		messages: messages,
		style: "css/chat.css",
	});
});

viewsRouter.get("/carts/:id", async (req, res) => {
    try {
        const cartId = req.params.id;
        const detailedCart = await cartDB.getCartWithProductDetails(cartId);

        res.render("carts", {
            title: "Detalle del Carrito",
            detailedCart: detailedCart,
            style: "css/cart.css",
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
	const product = await productDB.getProducts();
	res.render("realtime", {
		title: "Productos en tiempo real",
		product: product,
		style: "css/products.css",
	});
});

viewsRouter.get("/signup", (req, res) => {
    res.render("signup", {
      title: "Registrarse",
    });
  });

viewsRouter.get("/login", (req, res) => {
    res.render("login", {
        title: "Iniciar Sesion"
    })
})

export default viewsRouter;
