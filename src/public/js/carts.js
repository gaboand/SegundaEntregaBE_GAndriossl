
function emptyCart() {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        const cartId = "65b5ee2e97c0d595395c3355";

        fetch(`/api/carts/${cartId}/empty`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log("Carrito vaciado con éxito");
                } else {
                    console.error(data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    } else {

        console.log("el usuario prefirió no vaciar el carrito");
    }
}


function deleteProductFromCart(productId) {

    if (confirm("¿Deseas eliminar este producto del carrito?")) {
        const cartId = "65b5ee2e97c0d595395c3355";

        fetch(`/api/carts/${cartId}/product/${productId}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(`Producto ${productId} eliminado con éxito del carrito`);
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
    const cartId = "65b5ee2e97c0d595395c3355";

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
        } else {
            console.error(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
};



