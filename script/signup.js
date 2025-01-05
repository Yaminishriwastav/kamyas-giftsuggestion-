document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    fetch('https://lying-discreet-spur.glitch.me/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json())
    .then(user => {
      localStorage.setItem('user', JSON.stringify(user));
      // Show success message as an alert
      alert(`Account Created! Welcome, ${user.username}. Now login to your account.`);
      // Hide the signup form and display the login link (if needed)
      document.getElementById('login.html').style.display = 'none';
    });
  });
  