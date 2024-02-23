function updateQuantity(action, quantityId) {
    var quantityElement = document.getElementById(quantityId);
    var currentQuantity = parseInt(quantityElement.value);
    var maxQuantity = parseInt(quantityElement.max);

    if (action === 'plus' && currentQuantity < maxQuantity) {
        quantityElement.value = currentQuantity + 1;
    } else if (action === 'minus' && currentQuantity > 1) {
        quantityElement.value = currentQuantity - 1;
    }
}

async function addToCart(productId)  {
    const quantityId = `quantity-${productId}`;
    const quantity = document.getElementById(quantityId).value;
    const cartId = localStorage.getItem('cartId');

    if (!cartId) {
        alert('Por favor, inicia sesión para agregar productos al carrito.');
        return;
      }

    try {
        const response = await fetch(`/api/carts/${cartId}/product`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pid: productId,
                quantity: parseInt(quantity, 10),
                otherDetails: {}
            })
        });
        const data = await response.json();
        console.log(data);
        alert('Producto agregado al carrito');
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
    }
}

function reloadList(products) {
    const productList = document.getElementById("productList");

    productList.innerHTML = "";

    products.forEach((product) => {
        const card = document.createElement("div");
        card.classList.add("productCard");
        card.innerHTML = `
            <div class="cardProduct__image">
                <img src=${product.thumbnail} alt=${product.title} />
            </div>
            <div class="cardProduct__info">
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <p>${product.price}</p>
                <p>${product.stock}</p>
                <p>${product.code}</p>
                <p>${product._id}</p>
            </div>`;
        productList.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('verCarritoBtn').addEventListener('click', function() {
        const cartId = localStorage.getItem('cartId');
        if (cartId) {
            window.location.href = `/carts/${cartId}`;
        } else {
            alert('No se encontró el carrito.');
        }
    });
});


  document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cartId = urlParams.get('cartId');
    if (cartId) {
      localStorage.setItem('cartId', cartId);
    }
  });