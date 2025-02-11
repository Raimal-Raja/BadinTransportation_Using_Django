document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookingForm');
    const receipt = document.querySelector('.receipt');
    const vehicleSelect = document.getElementById('vehicleType');
    const riderPhoneInput = document.getElementById('riderPhone');
    const vehicleNumberInput = document.getElementById('vehicleNumber');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Input elements
    const customerNameInput = document.getElementById('customerName');
    const phoneNumberInput = document.getElementById('customerPhone');
    const pickupLocationInput = document.getElementById('pickupLocation');
    const destinationInput = document.getElementById('destination');

    // Validation patterns
    const patterns = {
        name: /^[A-Za-z\s]{3,50}$/,
        phone: /^[0-9]{11}$/,
        location: /^[A-Za-z0-9\s,.-]{5,100}$/
    };

    // Error messages
    const errorMessages = {
        name: 'Name should contain only letters and spaces (3-50 characters)',
        phone: 'Please enter a valid 11-digit phone number',
        location: 'Please enter a valid location (5-100 characters)',
        vehicle: 'Please select a vehicle type',
        rider: 'No riders available'
    };

    // Validation functions
    function validateInput(input, pattern, errorMessage) {
        const isValid = pattern.test(input.value);
        if (!isValid) {
            showError(input, errorMessage);
        } else {
            clearError(input);
        }
        return isValid;
    }

    function showError(input, message) {
        const feedback = input.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = message;
        }
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    }

    function clearError(input) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }

    function showLoading() {
        if (loadingSpinner) {
            loadingSpinner.style.display = 'block';
        }
    }

    function hideLoading() {
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
    }

    // Add input event listeners for real-time validation
    customerNameInput.addEventListener('input', () => {
        validateInput(customerNameInput, patterns.name, errorMessages.name);
    });

    phoneNumberInput.addEventListener('input', () => {
        validateInput(phoneNumberInput, patterns.phone, errorMessages.phone);
    });

    pickupLocationInput.addEventListener('input', () => {
        validateInput(pickupLocationInput, patterns.location, errorMessages.location);
    });

    destinationInput.addEventListener('input', () => {
        validateInput(destinationInput, patterns.location, errorMessages.location);
    });

    // Fetch vehicle types from the server
    async function fetchVehicleTypes() {
        try {
            const response = await fetch('/api/vehicle-types/');
            const data = await response.json();
            
            if (data.vehicle_types) {
                vehicleSelect.innerHTML = '<option value="">Select Vehicle Type</option>';
                data.vehicle_types.forEach(type => {
                    const option = document.createElement('option');
                    option.value = type;
                    option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
                    vehicleSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error fetching vehicle types:', error);
            showError(vehicleSelect, 'Error loading vehicle types');
        }
    }

    // Handle vehicle type selection
    vehicleSelect.addEventListener('change', async function() {
        const selectedType = this.value;
        
        if (!selectedType) {
            showError(vehicleSelect, errorMessages.vehicle);
            riderPhoneInput.value = '';
            vehicleNumberInput.value = '';
            return;
        }
    
        try {
            const response = await fetch(`/api/available-riders/?vehicle_type=${encodeURIComponent(selectedType)}`);
            const data = await response.json();
            
            if (data.success && data.riders.length > 0) {
                const rider = data.riders[0];  // Get first available rider
                riderPhoneInput.value = rider.phone_number;
                vehicleNumberInput.value = rider.vehicle_number;
                // Store rider ID for form submission
                vehicleSelect.setAttribute('data-rider-id', rider.id);
                clearError(vehicleSelect);
            } else {
                showError(vehicleSelect, errorMessages.rider);
                riderPhoneInput.value = '';
                vehicleNumberInput.value = '';
            }
        } catch (error) {
            console.error('Error fetching riders:', error);
            showError(vehicleSelect, 'Error fetching available riders');
            riderPhoneInput.value = '';
            vehicleNumberInput.value = '';
        }
    });

    // Generate booking ID
    function generateBookingId() {
        return 'BK' + Date.now().toString().slice(-6);
    }

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validate all inputs before submission
        const isNameValid = validateInput(customerNameInput, patterns.name, errorMessages.name);
        const isPhoneValid = validateInput(phoneNumberInput, patterns.phone, errorMessages.phone);
        const isPickupValid = validateInput(pickupLocationInput, patterns.location, errorMessages.location);
        const isDestinationValid = validateInput(destinationInput, patterns.location, errorMessages.location);
        const isVehicleSelected = vehicleSelect.value !== '';

        if (!isVehicleSelected) {
            showError(vehicleSelect, errorMessages.vehicle);
        }

        if (!isNameValid || !isPhoneValid || !isPickupValid || !isDestinationValid || !isVehicleSelected) {
            return;
        }

        showLoading();

        try {
            const riderId = vehicleSelect.getAttribute('data-rider-id');
            if (!riderId) {
                throw new Error('No rider selected');
            }

            // Prepare booking data
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            const bookingData = {
                customer_name: customerNameInput.value,
                customer_phone: phoneNumberInput.value,
                pickup_location: pickupLocationInput.value,
                destination: destinationInput.value,
                vehicle_type: vehicleSelect.value,
                vehicle_number: vehicleNumberInput.value,
                rider_phone: riderPhoneInput.value
            };

            // Submit booking to server
            const response = await fetch('/api/create-booking/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify(bookingData)
            });

            const result = await response.json();

            if (result.success) {
                // Update receipt with booking details
                document.getElementById('receiptBookingId').textContent = result.booking_id;
                document.getElementById('receiptName').textContent = bookingData.customer_name;
                document.getElementById('receiptPhone').textContent = bookingData.customer_phone;
                document.getElementById('receiptVehicle').textContent = bookingData.vehicle_type;
                document.getElementById('receiptVehicleNumber').textContent = bookingData.vehicle_number;
                document.getElementById('receiptRiderPhone').textContent = bookingData.rider_phone;
                document.getElementById('receiptTime').textContent = new Date().toLocaleString();
                document.getElementById('receiptPickup').textContent = bookingData.pickup_location;
                document.getElementById('receiptDestination').textContent = bookingData.destination;

                // Hide form and show receipt with animation
                form.classList.add('fade-out');
                setTimeout(() => {
                    form.style.display = 'none';
                    receipt.classList.add('fade-in');
                    receipt.style.display = 'block';
                }, 300);

                // Reset form
                form.reset();
                const inputs = form.querySelectorAll('.form-control, .form-select');
                inputs.forEach(input => {
                    input.classList.remove('is-valid', 'is-invalid');
                });
            } else {
                throw new Error(result.message || 'Booking failed');
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Failed to create booking. Please try again.');
        } finally {
            hideLoading();
        }
    });

    // Initialize
    fetchVehicleTypes();

    // Add animation class when form is in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, { threshold: 0.1 });

    observer.observe(form);
});