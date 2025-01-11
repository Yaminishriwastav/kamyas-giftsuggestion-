const user = JSON.parse(localStorage.getItem('user'));

function logout() {
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// Listen for account form submission to update user details
document.getElementById('account-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const updatedUser = {
    ...user,
    username: document.getElementById('username').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    phone: document.getElementById('phone').value,
    address: {
      houseNumber: document.getElementById('house-number').value,
      pincode: document.getElementById('pincode').value,
      district: document.getElementById('district').value,
      state: document.getElementById('state').value
    },
    paymentMethod: document.getElementById('payment-method').value // Add payment method field
  };

  fetch(`https://lying-discreet-spur.glitch.me/users/${user.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedUser)
  })
  .then(response => response.json())
  .then(updatedUserData => {
    localStorage.setItem('user', JSON.stringify(updatedUserData));
    alert('Account updated successfully');
  });
});

// Load user details into form fields
document.getElementById('username').value = user.username;
document.getElementById('email').value = user.email;
document.getElementById('password').value = user.password;
document.getElementById('phone').value = user.phone || '';
document.getElementById('house-number').value = user.address ? user.address.houseNumber : '';
document.getElementById('pincode').value = user.address ? user.address.pincode : '';
document.getElementById('district').value = user.address ? user.address.district : '';
document.getElementById('state').value = user.address ? user.address.state : '';
document.getElementById('payment-method').value = user.paymentMethod || ''; // Load payment method (e.g., Paytm ID)
