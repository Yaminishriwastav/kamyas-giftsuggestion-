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
            <p><strong>Price:</strong> ₹${product.price} ${product.currency}</p>
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
  // Find the product in the cart using the productId
  const product = user.cart.find(id => id === productId);
  
  if (!product) {
    alert('Product not found in your cart.');
    return;
  }

  // Check if user has an address saved
  if (!user.address) {
    alert('Please update your delivery address in the account section before purchasing.');
    return;
  }

  // Ask for payment method (e.g., Paytm ID)
  const paymentMethod = prompt("Enter your Paytm ID for payment:");

  if (!paymentMethod) {
    alert('Payment not completed. Please provide a valid Paytm ID.');
    return;
  }

  // Confirm the purchase
  const confirmPurchase = confirm(`Are you sure you want to purchase: ${product.name}?`);

  if (confirmPurchase) {
    // Add the product to user's purchase history
    if (!user.purchases) {
      user.purchases = [];
    }
    user.purchases.push(productId); // Optionally, you could push the entire product object here

    // Remove the product from the cart after successful purchase
    removeFromCart(productId);

    // Simulate decreasing product quantity (if you have such logic in your API)
    fetch(`https://lying-discreet-spur.glitch.me/products/${productId}`)
      .then(response => response.json())
      .then(productData => {
        // Decrease the product quantity by 1 (if applicable)
        const updatedProductData = {
          ...productData,
          quantity: productData.quantity - 1
        };

        // Send the update to the backend
        fetch(`https://lying-discreet-spur.glitch.me/products/${productId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedProductData)
        })
        .then(response => response.json())
        .then(updatedProduct => {
          console.log('Product quantity after purchase:', updatedProduct);
        })
        .catch(error => {
          console.error('Error updating product quantity:', error);
        });

        // Show confirmation message
        alert(`Purchase successful! Your order is being processed. It will be delivered to: ${user.address}`);
      })
      .catch(error => {
        console.error('Error fetching product data:', error);
        alert('There was an issue processing your purchase.');
      });
  }
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
