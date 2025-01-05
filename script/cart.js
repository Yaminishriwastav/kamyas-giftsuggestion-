const user = JSON.parse(localStorage.getItem('user'));
function loadCart() {
  const cartContainer = document.getElementById('cart');
  cartContainer.innerHTML = ''; // Clear existing cart

  if (user.cart.length === 0) {
    cartContainer.innerHTML = `<p>Your cart is empty.</p>`;
  } else {
    user.cart.forEach(productId => {
      fetch(`https://lying-discreet-spur.glitch.me/products/${productId}`)
        .then(response => response.json())
        .then(product => {
          const productDiv = document.createElement('div');
          productDiv.innerHTML = `
            <h4>${product.name}</h4>
            <img src="${product.image}" alt="${product.name}" style="width: 100px; height: 100px;">
            <p>${product.description}</p>
            <p><strong>Price:</strong> ${product.price} ${product.currency}</p>
            <p><em>${product.tagline}</em></p>
            <button onclick="removeFromCart(${productId})">Remove from Cart</button>
            <button onclick="purchaseProduct(${productId})">Purchase</button>
          `;
          cartContainer.appendChild(productDiv);
        });
    });
  }
}

function removeFromCart(productId) {
  user.cart = user.cart.filter(id => id !== productId);
  updateUserData();
  loadCart();
}

function purchaseProduct(productId) {
  alert(`Purchasing product: ${productId}`);
  removeFromCart(productId);
}

function updateUserData() {
  // Send PUT request to update the user data on the backend
  fetch(`https://lying-discreet-spur.glitch.me/users/${user.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
  .then(response => response.json())
  .then(updatedUser => {
    localStorage.setItem('user', JSON.stringify(updatedUser));  // Update localStorage
  });
}

// Load the cart
loadCart();
