const API_URL = "https://lying-discreet-spur.glitch.me";

// Elements
const productListSection = document.getElementById("product-list-section");
const addProductSection = document.getElementById("add-product-section");
const editProductSection = document.getElementById("edit-product-section");
const productChartSection = document.getElementById("product-chart-section");
const removedProductsSection = document.getElementById("removed-products-section");
const accountDetailsSection = document.getElementById("account-details-section");

const productListContainer = document.getElementById("product-list");
const removedProductListContainer = document.getElementById("removed-product-list");
const adminUsername = document.getElementById("admin-username");
const adminEmail = document.getElementById("admin-email");
const adminImg = document.getElementById("admin-img");

// Show/Hide Sections
function showSection(section) {
    const sections = document.querySelectorAll(".section");
    sections.forEach(s => s.style.display = "none");
    section.style.display = "block";
}

// Toggle Sidebar
document.getElementById("toggle-sidebar").addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");
});

// Fetch Products from API
async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        renderProductList(products);
    } catch (error) {
        console.error("Error fetching product details:", error);
    }
}

// Render Product List
function renderProductList(products) {
    productListContainer.innerHTML = "";
    products.forEach(product => {
        const productElement = document.createElement("div");
        productElement.innerHTML = `
            <h4>${product.name}</h4>
            <p>Category: ${product.category}</p>
            <p>Price: ₹${product.price}</p>
            <p>${product.description}</p>
            <img src="${product.image}" alt="${product.name}" />
            <button onclick="editProduct(${product.id})">Edit</button>
            <button onclick="removeProduct(${product.id})">Remove</button>
        `;
        productListContainer.appendChild(productElement);
    });
}

// Edit Product
async function editProduct(productId) {
    try {
        const response = await fetch(`${API_URL}/products/${productId}`);
        const product = await response.json();
        document.getElementById("edit-name").value = product.name;
        document.getElementById("edit-category").value = product.category;
        document.getElementById("edit-price").value = product.price;
        document.getElementById("edit-description").value = product.description;
        document.getElementById("edit-image-url").value = product.image;
        document.getElementById("edit-offer-price").value = product.offerPrice;

        showSection(editProductSection);

        document.getElementById("edit-product-form").onsubmit = function (event) {
            event.preventDefault();
            updateProduct(productId);
        };
    } catch (error) {
        console.error("Error fetching product details:", error);
    }
}

// Update Product
async function updateProduct(productId) {
    const updatedProduct = {
        name: document.getElementById("edit-name").value,
        category: document.getElementById("edit-category").value,
        price: document.getElementById("edit-price").value,
        description: document.getElementById("edit-description").value,
        image: document.getElementById("edit-image-url").value,
        offerPrice: document.getElementById("edit-offer-price").value,
    };

    try {
        await fetch(`${API_URL}/products/${productId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct),
        });
        fetchProducts();
        alert("Product updated successfully!");
        showSection(productListSection);
    } catch (error) {
        console.error("Error updating product:", error);
    }
}

// Remove Product
async function removeProduct(productId) {
    try {
        const response = await fetch(`${API_URL}/products/${productId}`);
        const product = await response.json();

        // Move product to removed products
        await fetch(`${API_URL}/removedproducts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        });

        await fetch(`${API_URL}/products/${productId}`, { method: "DELETE" });
        fetchProducts();
        alert("Product removed successfully!");
    } catch (error) {
        console.error("Error removing product:", error);
    }
}

// Add New Product
document.getElementById("add-product-form").onsubmit = async function (event) {
    event.preventDefault();
    const newProduct = {
        name: document.getElementById("name").value,
        category: document.getElementById("category").value,
        price: document.getElementById("price").value,
        description: document.getElementById("description").value,
        image: document.getElementById("image-url").value,
        offerPrice: document.getElementById("offer-price").value,
    };

    try {
        await fetch(`${API_URL}/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newProduct),
        });
        fetchProducts();
        alert("Product added successfully!");
        showSection(productListSection);
    } catch (error) {
        console.error("Error adding product:", error);
    }
};

// Fetch Removed Products
async function fetchRemovedProducts() {
    try {
        const response = await fetch(`${API_URL}/removedproducts`);
        const removedProducts = await response.json();
        renderRemovedProductsList(removedProducts);
    } catch (error) {
        console.error("Error fetching removed products:", error);
    }
}

// Render Removed Products
function renderRemovedProductsList(removedProducts) {
    removedProductListContainer.innerHTML = "";
    removedProducts.forEach(product => {
        const removedProductElement = document.createElement("div");
        removedProductElement.innerHTML = `
            <h4>${product.name}</h4>
            <p>Category: ${product.category}</p>
            <p>Price: ₹${product.price}</p>
            <p>${product.description}</p>
            <img src="${product.image}" alt="${product.name}" />
            <button onclick="restoreProduct(${product.id})">Restore</button>
        `;
        removedProductListContainer.appendChild(removedProductElement);
    });
}

// Restore Removed Product
async function restoreProduct(productId) {
    try {
        const response = await fetch(`${API_URL}/removedproducts/${productId}`);
        const product = await response.json();
        await fetch(`${API_URL}/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        });
        fetchRemovedProducts();
        alert("Product restored successfully!");
    } catch (error) {
        console.error("Error restoring product:", error);
    }
}

// Fetch Admin Account Details
async function fetchAdminDetails() {
    try {
        const response = await fetch(`${API_URL}/users/1`); // Assuming the admin ID is 1
        const adminDetails = await response.json();
        adminUsername.textContent = adminDetails.username;
        adminEmail.textContent = adminDetails.email;
        adminImg.src = adminDetails.image; // Assuming you store the image URL in the admin's data
    } catch (error) {
        console.error("Error fetching admin details:", error);
    }
}

// Handle Admin Account Update
document.getElementById("account-form").onsubmit = async function (event) {
    event.preventDefault();

    const updatedAdmin = {
        username: document.getElementById("admin-username-input").value,
        password: document.getElementById("admin-password").value,
        email: document.getElementById("admin-email-input").value,
        phone: document.getElementById("admin-phone").value,
        image: document.getElementById("admin-image").files[0] ? URL.createObjectURL(document.getElementById("admin-image").files[0]) : "", // Handle profile image
    };

    try {
        await fetch(`${API_URL}/users/1`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedAdmin),
        });
        fetchAdminDetails();
        alert("Admin account updated successfully!");
        showSection(accountDetailsSection);
    } catch (error) {
        console.error("Error updating admin account:", error);
    }
}

// Event Listeners for Sidebar Links
document.getElementById("view-product-list").addEventListener("click", () => {
    showSection(productListSection);
    fetchProducts();
});

document.getElementById("add-product-btn").addEventListener("click", () => {
    showSection(addProductSection);
});

document.getElementById("removed-products-btn").addEventListener("click", () => {
    showSection(removedProductsSection);
    fetchRemovedProducts();
});

document.getElementById("account-details-btn").addEventListener("click", () => {
    showSection(accountDetailsSection);
    fetchAdminDetails();
});

// Fetch Product Chart Data
async function fetchProductChartData() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        const categories = {};
        
        products.forEach(product => {
            categories[product.category] = (categories[product.category] || 0) + 1;
        });

        renderProductChart(categories);
    } catch (error) {
        console.error("Error fetching product chart data:", error);
    }
}

// Render Product Chart
function renderProductChart(data) {
    const ctx = document.getElementById('productChart').getContext('2d');
    const chartData = {
        labels: Object.keys(data),
        datasets: [{
            label: 'Product Count by Category',
            data: Object.values(data),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };

    new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Call fetchProductChartData on page load
fetchProductChartData();