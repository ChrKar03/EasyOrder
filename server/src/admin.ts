interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    pic: string;
}

let currentEditProductId: number | null = null;
const MAX_FILE_SIZE = 64 * 1024; // 64 KB

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupFilterButton();
    setupModal();
    setupDragAndDrop();
});

async function loadProducts(): Promise<void> {
    try {
        const response = await fetch('http://localhost:3000/products');
        const products: Product[] = await response.json();
        const container = document.getElementById('tiles-container') as HTMLElement;
        container.innerHTML = '';
        products.forEach(product => {
            const tileElement = createTileElement(product);
            container.appendChild(tileElement);
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function createTileElement(product: Product): HTMLElement {
    const tileElement = document.createElement('div');
    tileElement.className = 'tile';

    const img = document.createElement('img');
    img.src = product.pic;
    tileElement.appendChild(img);

    const title = document.createElement('h2');
    title.textContent = product.name;
    tileElement.appendChild(title);

    const description = document.createElement('p');
    description.textContent = product.description;
    tileElement.appendChild(description);

    const price = document.createElement('p');
    price.textContent = `${product.price}€`;
    tileElement.appendChild(price);

    const category = document.createElement('p');
    category.textContent = `Category: ${product.category}`;
    tileElement.id = product.category;
    tileElement.appendChild(category);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'edit-button';
    editButton.addEventListener('click', () => openEditModal(product));
    tileElement.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', () => deleteProduct(product.id));
    tileElement.appendChild(deleteButton);

    return tileElement;
}

async function editProduct(product: Product): Promise<void> {
    try {
        const response = await fetch('http://localhost:3000/products', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            throw new Error('Failed to edit product');
        }

        loadProducts();
    } catch (error) {
        console.error('Error editing product:', error);
    }
}

async function deleteProduct(id: number): Promise<void> {
    try {
        const response = await fetch('http://localhost:3000/products/' + id, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete product');
        }

        loadProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

function setupFilterButton(): void {
    const filterBtn = document.getElementById('filterBtn') as HTMLElement;
    const filterPopup = document.getElementById('filterPopup') as HTMLElement;

    let isFilterApplied = false; // Track if the filter is currently applied

    filterBtn.addEventListener('click', () => {
        filterPopup.style.display = filterPopup.style.display === 'block' ? 'none' : 'block';
        loadCategories();
    });

    window.addEventListener('click', (event) => {
        if (event.target !== filterBtn && event.target !== filterPopup) {
            filterPopup.style.display = 'none';
        }
    });

    filterPopup.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (target.tagName === 'BUTTON') {
            const category = target.textContent;
            isFilterApplied = !isFilterApplied; // Toggle the filter status
            filterProductsByCategory(category, isFilterApplied);
        }
    });
}

async function loadCategories(): Promise<void> {
    try {
        const response = await fetch('http://localhost:3000/products');
        const products: Product[] = await response.json();
        const categories = [...new Set(products.map(product => product.category))];
        const filterPopup = document.getElementById('filterPopup') as HTMLElement;
        filterPopup.innerHTML = '';

        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category;
            button.addEventListener('click', () => filterProductsByCategory(category, true));
            filterPopup.appendChild(button);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

function filterProductsByCategory(category: string, isFilterApplied: boolean): void {
    const container = document.getElementById('tiles-container') as HTMLElement;
    const tiles = container.getElementsByClassName('tile');
    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i] as HTMLElement;
        const tileCategory = tile.id;
        if (isFilterApplied) {
            if (tileCategory === category) {
                tile.style.display = 'block';
            } else {
                tile.style.display = 'none';
            }
        } else {
            tile.style.display = 'block';
        }
    }
}

function setupModal(): void {
    const addProductBtn = document.getElementById('addProductBtn') as HTMLElement;
    const formModal = document.getElementById('formModal') as HTMLElement;
    const closeModal = document.getElementsByClassName('close')[0] as HTMLElement;

    addProductBtn.onclick = () => {
        formModal.style.display = 'block';
        clearForm();
        currentEditProductId = null;
    };

    closeModal.onclick = () => {
        formModal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === formModal) {
            formModal.style.display = 'none';
        }
    };

    const productForm = document.getElementById('productForm') as HTMLFormElement;
    productForm.onsubmit = (event) => {
        event.preventDefault();
        if (currentEditProductId !== null) {
            submitEdit();
        } else {
            addElement();
        }
        formModal.style.display = 'none';
    };
}

function setupDragAndDrop(): void {
    const dropZone = document.getElementById('dropZone') as HTMLElement;
    const picInput = document.getElementById('pic') as HTMLInputElement;

    dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        dropZone.classList.remove('dragover');
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.size > MAX_FILE_SIZE) {
                alert('File is too large. Maximum allowed size is 64 KB.');
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                picInput.value = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    });
}

async function addElement(): Promise<void> {
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const descriptionInput = document.getElementById('description') as HTMLTextAreaElement;
    const priceInput = document.getElementById('price') as HTMLInputElement;
    const categoryInput = document.getElementById('category') as HTMLInputElement;
    const picInput = document.getElementById('pic') as HTMLInputElement;

    const newProduct: Product = {
        id: Date.now(), // Assuming the server will assign a proper ID
        name: nameInput.value,
        description: descriptionInput.value,
        price: parseFloat(priceInput.value),
        category: categoryInput.value,
        pic: picInput.value
    };

    try {
        const response = await fetch('http://localhost:3000/products/addnew', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        });

        if (!response.ok) {
            throw new Error('Failed to add product');
        }

        loadProducts();
    } catch (error) {
        console.error('Error adding product:', error);
    }
}

function openEditModal(product: Product): void {
    const formModal = document.getElementById('formModal') as HTMLElement;
    formModal.style.display = 'block';

    const nameInput = document.getElementById('name') as HTMLInputElement;
    const descriptionInput = document.getElementById('description') as HTMLTextAreaElement;
    const priceInput = document.getElementById('price') as HTMLInputElement;
    const categoryInput = document.getElementById('category') as HTMLInputElement;
    const picInput = document.getElementById('pic') as HTMLInputElement;

    nameInput.value = product.name;
    descriptionInput.value = product.description;
    priceInput.value = product.price.toString();
    categoryInput.value = product.category;
    picInput.value = product.pic;

    currentEditProductId = product.id;
}

async function submitEdit(): Promise<void> {
    if (currentEditProductId === null) return;

    const nameInput = document.getElementById('name') as HTMLInputElement;
    const descriptionInput = document.getElementById('description') as HTMLTextAreaElement;
    const priceInput = document.getElementById('price') as HTMLInputElement;
    const categoryInput = document.getElementById('category') as HTMLInputElement;
    const picInput = document.getElementById('pic') as HTMLInputElement;

    const updatedProduct: Product = {
        id: currentEditProductId,
        name: nameInput.value,
        description: descriptionInput.value,
        price: parseFloat(priceInput.value),
        category: categoryInput.value,
        pic: picInput.value
    };

    await editProduct(updatedProduct);
}

function clearForm(): void {
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const descriptionInput = document.getElementById('description') as HTMLTextAreaElement;
    const priceInput = document.getElementById('price') as HTMLInputElement;
    const categoryInput = document.getElementById('category') as HTMLInputElement;
    const picInput = document.getElementById('pic') as HTMLInputElement;

    nameInput.value = '';
    descriptionInput.value = '';
    priceInput.value = '';
    categoryInput.value = '';
    picInput.value = '';
}
