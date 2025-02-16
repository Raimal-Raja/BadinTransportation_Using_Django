document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('riderForm');
    const successMessage = document.querySelector('.success-message');
    const errorMessage = document.querySelector('.error-message');

    // Validation functions
    const validators = {
        name: (value) => {
            const isValid = value.length >= 2 && /^[a-zA-Z\s]+$/.test(value);
            return {
                isValid,
                message: isValid ? '' : 'Name should contain only letters and be at least 2 characters long'
            };
        },
        phone: (value) => {
            const isValid = /^\d{10}$/.test(value);
            return {
                isValid,
                message: isValid ? '' : 'Phone number should be 10 digits'
            };
        },
        location: (value) => {
            const isValid = value.length >= 3;
            return {
                isValid,
                message: isValid ? '' : 'Location should be at least 3 characters long'
            };
        },
        vehicle: (value) => {
            const isValid = value !== '';
            return {
                isValid,
                message: isValid ? '' : 'Please select a vehicle type'
            };
        },
        vehicleNumber: (value) => {
            const isValid = /^[A-Z0-9-]{5,10}$/.test(value);
            return {
                isValid,
                message: isValid ? '' : 'Vehicle number should be 5-10 characters (uppercase letters, numbers, hyphens)'
            };
        },
        email: (value) => {
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            return {
                isValid,
                message: isValid ? '' : 'Please enter a valid email address'
            };
        },
        password: (value) => {
            const isValid = value.length >= 8 &&
                /[A-Z]/.test(value) &&
                /[a-z]/.test(value) &&
                /[0-9]/.test(value);
            return {
                isValid,
                message: isValid ? '' : 'Password must be at least 8 characters with uppercase, lowercase, and numbers'
            };
        },
        confirmPassword: (value) => {
            const password = document.getElementById('password').value;
            const isValid = value === password;
            return {
                isValid,
                message: isValid ? '' : 'Passwords do not match'
            };
        }
    };

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }

    // Show success message
    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
    }

    // Real-time validation for each field
    Object.keys(validators).forEach(field => {
        const input = document.getElementById(field);
        if (input) {
            input.addEventListener('input', function () {
                validateField(this);
            });

            input.addEventListener('blur', function () {
                validateField(this, true);
            });
        }
    });

    // Validate a single field
    function validateField(input, showMessage = false) {
        const validation = validators[input.id](input.value);
        const errorDisplay = input.nextElementSibling;

        if (validation.isValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            if (errorDisplay && errorDisplay.classList.contains('invalid-feedback')) {
                errorDisplay.style.display = 'none';
            }
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            if (errorDisplay && errorDisplay.classList.contains('invalid-feedback')) {
                errorDisplay.textContent = validation.message;
                errorDisplay.style.display = showMessage ? 'block' : 'none';
            }
        }

        return validation.isValid;
    }

    // Form submission
    form.addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent default form submission

        let isFormValid = true;

        // Validate all fields
        Object.keys(validators).forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                const isValid = validateField(input, true);
                if (!isValid) {
                    isFormValid = false;
                }
            }
        });

        if (!isFormValid) {
            showError('Please fix the errors in the form.');
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Registering...';

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                },
                credentials: 'same-origin'
            });

            if (response.ok) {
                form.style.display = 'none';
                showSuccess('Registration successful! Redirecting to login page...');
                setTimeout(() => {
                    window.location.href = '/login/';
                }, 2000);
            } else {
                const data = await response.json();
                showError(data.message || 'Registration failed. Please try again.');
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        } catch (error) {
            showError('An error occurred. Please try again.');
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
});