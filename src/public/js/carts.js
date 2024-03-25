function getCartId() {
    return localStorage.getItem('cartId');
}

function emptyCart() {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        const cartId = getCartId();

        fetch(`/api/carts/${cartId}/empty`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log("Carrito vaciado con éxito");
                    loadCartDetails();
                    updateCartUI({ total: 0, totalProducts: 0 });
                } else {
                    console.error(data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    } else {
        console.log("El usuario prefirió no vaciar el carrito");
    }
}

function deleteProductFromCart(productId) {
    if (confirm("¿Deseas eliminar este producto del carrito?")) {
        const cartId = getCartId(); 

        fetch(`/api/carts/${cartId}/product/${productId}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(`Producto ${productId} eliminado con éxito del carrito`);
                    loadCartDetails();
                } else {
                    console.error(data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    } else {
        console.log("El usuario prefirió no eliminar este producto");
    }
}

function updateCartQuantity(action, productId) {
    var quantityElement = document.getElementById('quantity-' + productId);
    var currentQuantity = parseInt(quantityElement.value);

    if (action === 'plus') {
        currentQuantity += 1;
    } else if (action === 'minus' && currentQuantity > 1) {
        currentQuantity -= 1;
    }

    quantityElement.value = currentQuantity;
    updateQuantityOnServer(productId, currentQuantity);
}

function updateQuantityOnServer(productId, newQuantity) {
    const cartId = getCartId();

    fetch(`/api/carts/${cartId}/product/${productId}/quantity`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("Cantidad del producto actualizada con éxito");
            loadCartDetails();
        } else {
            console.error(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}


function updateCartUI(cart) {

    const totalElement = document.getElementById('cartTotal');
    const quantityElement = document.getElementById('cartQuantity');

    if (totalElement && quantityElement) {
        totalElement.textContent = `Total: $${cart.total}`;
        quantityElement.textContent = `Cantidad de Productos: ${cart.totalProducts}`;
    }
}

async function loadCartDetails() {
    const cartId = getCartId();
    if (!cartId) {
        console.log("No se encontró el cartId");
        return;
    }

    try {
        const response = await fetch(`/api/carts/${cartId}`);
        const cart = await response.json();

        const productList = document.querySelector('.cart__productList');
        productList.innerHTML = '';
        updateCartUI(cart);

        if (cart.products && cart.products.length > 0) {
            cart.products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'cart__productCard';
                productCard.innerHTML = `
                    <div class="cart__cardProduct__image">
                        <img src="${product.productId.thumbnail}" alt="${product.productId.title}" />
                    </div>
                    <div>
                        <h3 class="cart__nombreProducto">${product.productId.title}</h3>
                        <p class="cart__detalleProducto">${product.productId.description}</p>
                        <p class="cart__detalleProducto">Precio: $${product.productId.price}</p>
                        <p class="cart__detalleProducto">Cantidad: ${product.quantity}</p>
                        <div class="cartControl">
                            <button class="boton_menos" type="button" onclick="updateCartQuantity('minus', '${product.productId._id}')">-</button>
                            <input type="number" id="quantity-${product.productId._id}" name="quantity" min="1" value="${product.quantity}" class="cantidad" />
                            <button class="boton_mas" type="button" onclick="updateCartQuantity('plus', '${product.productId._id}')">+</button>
                        </div>
                    </div>
                    <div class="cart__cardProduct__delete">
                        <button class="cart__btnDelete" data-id="${product._id}" onclick="deleteProductFromCart('${product._id}')">X</button>
                    </div>
                `;
                productList.appendChild(productCard);
            });
        } else {
            productList.innerHTML = '<p>No hay productos en el carrito.</p>';
        }
    } catch (error) {
        console.error('Error al cargar los detalles del carrito:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadCartDetails);
