const baseUrl = "https://lying-discreet-spur.glitch.me/";

document.getElementById('gift-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get values from form fields
    const occasion = document.getElementById('occasion').value;
    const preferences = document.getElementById('preferences').value;
    const giftType = document.getElementById('gift-type').value;

    if (!occasion || !preferences || !giftType) {
        alert("Please fill in all fields!");
        return;
    }

    // Fetch products from API
    fetch(`${baseUrl}products`)
        .then(response => response.json())
        .then(products => {
            // Filter products based on preference (category) and match with available preferences
            const filteredProducts = products.filter(product => {
                return product.category.toLowerCase().includes(preferences.toLowerCase());
            });

            // If no products match the preference
            if (filteredProducts.length === 0) {
                document.getElementById('suggestion').innerHTML = `
                    <p>No products found in the "${preferences}" category. Please try another preference or occasion.</p>
                    <p>We have gifts from categories like Soft Toys, Electronics, Home Decor, and more!</p>
                `;
                return;
            }

            // Display matching products as cards
            let suggestionHTML = `<h4>Suggested Gift for ${occasion}</h4>`;
            filteredProducts.forEach(product => {
                suggestionHTML += `
                    <div class="card">
                        <img src="${product.image}" alt="${product.name}" class="card-img"/>
                        <h3 class="card-title">${product.name}</h3>
                        <p class="card-category">Category: ${product.category}</p>
                        <p class="card-price">Price: ₹${product.price} ${product.currency}</p>
                        <p class="card-description">${product.description}</p>
                        <p class="card-tagline"><em>${product.tagline}</em></p>
                        <button class="add-to-wishlist" data-id="${product.id}">Add to Wishlist</button>
                    </div>
                `;
            });
            document.getElementById('suggestion').innerHTML = suggestionHTML;

            // Add event listeners for Wishlist button
            addEventListeners(filteredProducts);
        })
        .catch(error => {
            document.getElementById('suggestion').innerHTML = '<p>There was an error fetching suggestions. Please try again later.</p>';
        });
});

// Event listeners for Wishlist button
const addEventListeners = (products) => {
    let user = JSON.parse(localStorage.getItem('user'));

    // Initialize wishlist if not already present
    if (!user) {
        alert('You must be logged in to perform this action!');
        window.location.href = 'login.html'; // Redirect to login if not logged in
        return;
    }

    if (!user.wishlist) {
        user.wishlist = [];
        localStorage.setItem('user', JSON.stringify(user)); // Save initial state
    }

    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);

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
};
