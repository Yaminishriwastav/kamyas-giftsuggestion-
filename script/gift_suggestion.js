// Handle form submission
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
    fetch('https://lying-discreet-spur.glitch.me/products')
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

        // Display matching products
        let suggestionHTML = `<h4>Suggested Gift for ${occasion}</h4>`;
        filteredProducts.forEach(product => {
          suggestionHTML += `
          <p><strong>${product.name}</strong>: ${product.description}</p>
          <p><em>Category: ${product.category}</em></p>
          <p><strong>Price:</strong> ${product.price} ${product.currency}</p>
          <p><em>Tagline:</em> "${product.tagline}"</p>
          <img src="${product.image}" alt="${product.name}" style="width: 100px; height: auto;">
           `;
        });
        document.getElementById('suggestion').innerHTML = suggestionHTML;
      })
      .catch(error => {
        document.getElementById('suggestion').innerHTML = '<p>There was an error fetching suggestions. Please try again later.</p>';
      });
  });