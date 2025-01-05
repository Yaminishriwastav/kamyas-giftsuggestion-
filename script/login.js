document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Fetch user data from the API
    fetch('https://lying-discreet-spur.glitch.me/users')
      .then(response => response.json())
      .then(users => {
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
          // Save user info in localStorage
          localStorage.setItem('user', JSON.stringify(user));

          // Display alert message based on role
          if (user.role === 'admin') {
            alert('Welcome Admin Ready to work!');
            window.location.href = 'admin-dashboard.html'; // Redirect to admin dashboard
          } else {
            alert(`Welcome ${user.username} Go and explore!`);
            window.location.href = 'user_dashboard.html'; // Redirect to user dashboard
          }
        } else {
          alert('Invalid credentials');
        }
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        alert('An error occurred while trying to log in. Please try again.');
      });
  });
