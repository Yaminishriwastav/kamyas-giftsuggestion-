const user = JSON.parse(localStorage.getItem('user')) || { wishlist: [], cart: [] };

function loadWishlist() {
  const wishlistContainer = document.getElementById('wishlist');
  wishlistContainer.innerHTML = ''; // Clear existing wishlist

  if (user.wishlist.length === 0) {
    wishlistContainer.innerHTML = `<p>Your wishlist is empty.</p>`;
    return;
  }

  user.wishlist.forEach(productId => {
    fetch(`https://lying-discreet-spur.glitch.me/products/${productId}`)
      .then(response => response.json())
      .then(product => {
        const productDiv = document.createElement('div');
        productDiv.innerHTML = `
          <h4>${product.name}</h4>
          <img src="${product.image}" alt="${product.name}">
          <p>${product.description}</p>
          <p><strong>Price:</strong> ${product.price} ${product.currency}</p>
          <p><em>${product.tagline}</em></p>
          <button onclick="removeFromWishlist(${productId})">Remove from Wishlist</button>
          <button onclick="addToCart(${productId})">Add to Cart</button>
        `;
        wishlistContainer.appendChild(productDiv);
      });
  });
}

function removeFromWishlist(productId) {
  user.wishlist = user.wishlist.filter(id => id !== productId);
  updateUserData();
  loadWishlist();
}

function addToCart(productId) {
  if (!user.cart.includes(productId)) {
    user.cart.push(productId);
    updateUserData();
    alert('Product added to cart!');
  }
}

function updateUserData() {
  fetch(`https://lying-discreet-spur.glitch.me/users/${user.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
    .then(response => response.json())
    .then(updatedUser => {
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Update localStorage
    });
}

// Load wishlist on page load
loadWishlist();
