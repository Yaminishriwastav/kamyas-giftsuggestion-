const baseUrl = "https://lying-discreet-spur.glitch.me/";

document.addEventListener('DOMContentLoaded', () => {
    const categoryFilter = document.querySelector('#category-filter');
    const sortFilter = document.querySelector('#sort-filter');
    const productList = document.querySelector('#product-list');
    let products = []; // Array to store fetched products
    let user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        alert('You must be logged in to view this page!');
        window.location.href = 'login.html'; // Redirect to login if not logged in
        return;
    }

    // Initialize user wishlist and cart if not present
    if (!user.wishlist) {
        user.wishlist = [];
        localStorage.setItem('user', JSON.stringify(user)); // Save initial state
    }
    if (!user.cart) {
        user.cart = [];
        localStorage.setItem('user', JSON.stringify(user)); // Save initial state
    }

    // Fetch products from API
    fetch(`${baseUrl}products`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching products: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            products = data;
            applyFilters(); // Render products after fetching
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            productList.innerHTML = '<p>Error loading products. Please try again later.</p>';
        });

    // Function to render products
    const renderProducts = (filteredProducts) => {
        productList.innerHTML = ''; // Clear current products
        filteredProducts.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" />
                <h3>${product.name}</h3>
                <p>Category: ${product.category}</p>
                <p>Price: ₹${product.price} ${product.currency}</p> <!-- Showing currency -->
                <p>${product.description}</p>
                <p><strong>${product.tagline}</strong></p> <!-- Display tagline -->
                <button class="add-to-wishlist" data-id="${product.id}">Add to Wishlist</button>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            `;
            productList.appendChild(productElement);
        });

        // Add event listeners for Wishlist and Cart buttons
        addEventListeners();
    };

    // Add event listeners to buttons
    const addEventListeners = () => {
        document.querySelectorAll('.add-to-wishlist').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                const product = products.find(p => p.id === productId);

                // Debugging: Check if product is being correctly found
                console.log('Product:', product);

                // Check if the product is already in the wishlist
                if (!user.wishlist.includes(productId)) {
                    user.wishlist.push(productId);
                    localStorage.setItem('user', JSON.stringify(user)); // Update user data in localStorage
                    alert('Added to Wishlist!');
                    e.target.innerText = 'Added to Wishlist';  // Update button text
                    e.target.disabled = true;  // Disable button
                } else {
                    alert('Product is already in your Wishlist!');
                    e.target.innerText = 'Already in Wishlist';  // Update button text
                    e.target.disabled = true;  // Disable button
                }
            });
        });

        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                const product = products.find(p => p.id === productId);

                // Debugging: Check if product is being correctly found
                console.log('Product:', product);

                // Check if the product is already in the cart
                if (!user.cart.includes(productId)) {
                    user.cart.push(productId);
                    localStorage.setItem('user', JSON.stringify(user)); // Update user data in localStorage
                    alert('Added to Cart!');
                    e.target.innerText = 'Added to Cart';  // Update button text
                    e.target.disabled = true;  // Disable button
                } else {
                    alert('Product is already in your Cart!');
                    e.target.innerText = 'Already in Cart';  // Update button text
                    e.target.disabled = true;  // Disable button
                }
            });
        });
    };

    // Apply filters and sorting
    const applyFilters = () => {
        let filteredProducts = [...products]; // Clone products array

        // Apply category filter
        const selectedCategory = categoryFilter.value;
        if (selectedCategory) {
            filteredProducts = filteredProducts.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase());
        }

        // Apply sorting
        const selectedSort = sortFilter.value;
        switch (selectedSort) {
            case 'az':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'za':
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'price-asc':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        }

        renderProducts(filteredProducts); // Render filtered products
    };

    // Event listeners for filters
    categoryFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);

    // Debugging: Check cart and wishlist from localStorage
    console.log('User Wishlist:', user.wishlist);
    console.log('User Cart:', user.cart);
});
