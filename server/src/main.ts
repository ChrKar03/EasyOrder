interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    pic: string;
}

let cart: { product: Product, quantity: number, comment: string }[] = [];

// Load the cart on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    const url = window.location.href;
    let lastString = url.substring(url.lastIndexOf('/') + 1);
    if (lastString.endsWith('.html')) {
        lastString = lastString.substring(0, lastString.length - 5); // Remove the '.html' extension
    }
    if (lastString !== "index") {
        requestProducts(lastString);
    }
});

async function requestProducts(category: string): Promise<void> {
    try {
        const response = await fetch('http://localhost:3000/products/' + category);
        if (!response.ok) {
            throw new Error('Failed to load products');
        }
        const products: Product[] = await response.json();
        const container = document.getElementById('tiles-container') as HTMLElement;
        container.innerHTML = '';
        products.forEach(product => {
            const tileElement = makeTileElement(product);
            container.appendChild(tileElement);
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function makeTileElement(product: Product): HTMLElement {
    const tileElement = document.createElement('div');
    tileElement.className = 'tile';

    if (product.pic !== "") {
        const img = document.createElement('img');
        img.src = product.pic;
        tileElement.appendChild(img);
    }

    const title = document.createElement('h2');
    title.textContent = product.name;
    tileElement.appendChild(title);

    if (product.description !== "") {
        const description = document.createElement('p');
        description.textContent = product.description;
        tileElement.appendChild(description);
    }

    const price = document.createElement('p');
    price.textContent = `${product.price}€`;
    tileElement.appendChild(price);

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.value = '1';
    quantityInput.min = '1';
    tileElement.appendChild(quantityInput);

    const addButton = document.createElement('button');
    addButton.textContent = 'Add to Cart';
    addButton.onclick = () => openModal(product, parseInt(quantityInput.value));
    tileElement.appendChild(addButton);

    return tileElement;
}

function openModal(product: Product, quantity: number) {
    const productIdInput = document.getElementById('currentProductId') as HTMLInputElement;
    const productNameInput = document.getElementById('currentProductName') as HTMLInputElement;
    const productPriceInput = document.getElementById('currentProductPrice') as HTMLInputElement;
    const productQuantityInput = document.getElementById('currentProductQuantity') as HTMLInputElement;
    const modal = document.getElementById('commentModal') as HTMLDivElement;

    if (productIdInput && productNameInput && productPriceInput && productQuantityInput && modal) {
        productIdInput.value = product.id.toString();
        productNameInput.value = product.name;
        productPriceInput.value = product.price.toString();
        productQuantityInput.value = quantity.toString();
        modal.style.display = 'block';
    } else {
        console.error('Modal elements not found');
    }
}

function closeModal() {
    const modal = document.getElementById('commentModal') as HTMLDivElement;
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error('Modal element not found');
    }
}

function addToCart(product: Product, quantity: number, comment: string) {
    cart.push({
        product: product,
        quantity: quantity,
        comment: comment
    });
    saveCart();
}

function submitComment() {
    const productNameInput = document.getElementById('currentProductName') as HTMLInputElement;
    const productPriceInput = document.getElementById('currentProductPrice') as HTMLInputElement;
    const productQuantityInput = document.getElementById('currentProductQuantity') as HTMLInputElement;
    const commentInput = document.getElementById('productComment') as HTMLTextAreaElement;
    const productIdInput = document.getElementById('currentProductId') as HTMLInputElement;

    if (productNameInput && productPriceInput && productQuantityInput && commentInput && productIdInput) {
        const productName = productNameInput.value;
        const productPrice = parseFloat(productPriceInput.value);
        const quantity = parseInt(productQuantityInput.value);
        const comment = commentInput.value;
        const productId = parseInt(productIdInput.value);

        const product = { id: productId, name: productName, description: "", price: productPrice, category: "", pic: "" };

        addToCart(product, quantity, comment);
        closeModal();
    } else {
        console.error('Modal input elements not found');
    }
}

function saveCart() {
    sessionStorage.setItem('cart', JSON.stringify(cart));
    console.log('Cart saved:', cart);
}

function loadCart() {
    const cartData = sessionStorage.getItem('cart');
    if (cartData) {
        cart = JSON.parse(cartData);
        console.log('Cart loaded:', cart);
    }
}

function openCart() {
    let cartContent = cart.map(item => {
        return `${item.product.name} x${item.quantity} - ${item.product.price * item.quantity}€\nComment: ${item.comment}`;
    }).join('\n');
    alert(cartContent);
}

function redirectURL(url: string) {
    window.location.href = url;
}
