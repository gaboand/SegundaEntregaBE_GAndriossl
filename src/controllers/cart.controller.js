import {cartsDao} from "../dao/index.js"

const saveCart = async (req, res) => {
	try {
		const cartData = {}
		const cart = await cartsDao.createCart(cartData);

		res.status(200).json({
			success: true,
			message: "Carrito creado correctamente",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

const getCarts = async (req, res) => {
    try {
        const { limit } = req.query;
        const limitNumber = limit ? parseInt(limit, 10) : 10;

        const carts = await cartsDao.getCarts(limitNumber);

        if (carts.length === 0) {
            res.status(404).json({
                success: false,
                message: "Carritos no encontrados",
            });
            return;
        }

        res.status(200).json({
            success: true,
            carts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getCartDetails = async (req, res) => {
    try {
        const { cid } = req.params;
        const detailedCart = await cartsDao.getCartWithProductDetails(cid);

        if (!detailedCart) {
            res.status(404).json({
                success: false,
                message: "Carrito no encontrado",
            });
            return;
        }

        res.status(200).json({
            success: true,
            detailedCart,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al recuperar el carrito: " + error.message,
        });
    }
};

const addProduct = async (req, res) => {
    try {
        const { cid } = req.params;
        const { pid, quantity, otherDetails } = req.body;

        if (!pid || !quantity) {
            res.status(400).json({
                success: false,
                message: "Faltan datos del producto (ID y cantidad).",
            });
            return;
        }

        const updatedCart = await cartsDao.addProductToCart(cid, pid, quantity, otherDetails);
        if (!updatedCart) {
            res.status(404).json({
                success: false,
                message: `No se pudo agregar el producto ${pid} al carrito ${cid}.`,
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: `Producto ${pid} agregado al carrito ${cid}.`,
            cart: updatedCart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const { cid, productEntryId } = req.params;
        const deleted = await cartsDao.deleteProductFromCart(cid, productEntryId);
        if (!deleted) {
            res.status(404).json({
                success: false,
                message: `No se pudo borrar el producto ${productEntryId} del carrito ${cid}.`,
            });
            return;
        }
        console.log(cid, productEntryId);
        console.log(deleted);
        res.status(200).json({
            success: true,
            message: `El producto ${productEntryId} se borró del carrito ${cid}.`,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const empty = async (req, res) => {
    try {
        const { cid } = req.params;
        await cartsDao.emptyCart(cid);
        res.status(200).json({
            success: true,
            message: `Carrito ${cid} vaciado con éxito.`,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteCart = async (req, res) => {
    try {
        const { cid } = req.params;
        
        await cartsDao.deleteCartById(cid);
        
        const carts  = await cartsDao.getCarts();
        res.status(200).json({
            success: true,
            carts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateQuantity = async (req, res) => {
    try {
        const { cid, productId } = req.params;
        const { quantity } = req.body;
        const updatedCart = await cartsDao.updateProductQuantity(cid, productId, quantity);
        res.status(200).json({
            success: true,
            updatedCart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export { saveCart, getCarts, getCartDetails, addProduct, deleteProduct, empty, deleteCart, updateQuantity };