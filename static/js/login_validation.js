document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.querySelector('.error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent default form submission
            handleLogin();
        });
    }

    async function handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
    
        if (!email || !password) {
            showError('Please fill out all fields.');
            return;
        }
    
        try {
            const response = await fetch('/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
    
            const data = await response.json();
            console.log('Login Response:', data); // Debug: Log the response
    
            if (data.success) {
                // Store rider ID with the correct key 'rider_id'
                localStorage.setItem('rider_id', data.rider_id);
                console.log('Rider ID Stored:', data.rider_id); // Debug: Log the stored rider ID
                // Redirect to dashboard
                window.location.href = data.redirect_url;
            } else {
                showError(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('An error occurred. Please try again.');
        }
    }

    function showError(message) {
        const errorMessage = document.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';

            // Hide error after 5 seconds
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 5000);
        }
    }
});