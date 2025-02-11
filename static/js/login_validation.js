document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.querySelector('.error-message');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            handleLogin();
        });
    }

    async function handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.querySelector('.error-message');

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

            if (data.success) {
                // Store rider ID if needed
                localStorage.setItem('rider_id', data.rider_id);
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