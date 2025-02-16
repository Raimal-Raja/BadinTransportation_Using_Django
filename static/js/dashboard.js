document.addEventListener("DOMContentLoaded", function () {
    // Correct the key to 'rider_id'
    const riderId = localStorage.getItem('rider_id'); // Use 'rider_id' instead of 'riderId'
    if (!riderId) {
        window.location.href = '/login/'; // Redirect to login if riderId is not found
    }

    fetchOrders(riderId);
});

function fetchOrders(riderId) {
    fetch(`/api/orders/${riderId}/`)
        .then(response => response.json())
        .then(data => {
            const recentOrders = data.recent;
            const previousOrders = data.previous;

            const recentOrdersTable = document.getElementById('recentOrders');
            const previousOrdersTable = document.getElementById('previousOrders');

            recentOrders.forEach(order => {
                const row = `<tr>
                    <td>${order.customer_name}</td>
                    <td>${order.pickup_location}</td>
                    <td>${order.destination}</td>
                </tr>`;
                recentOrdersTable.innerHTML += row;
            });

            previousOrders.forEach(order => {
                const row = `<tr>
                    <td>${order.customer_name}</td>
                    <td>${order.pickup_location}</td>
                    <td>${order.destination}</td>
                </tr>`;
                previousOrdersTable.innerHTML += row;
            });
        })
        .catch(error => console.error('Error fetching orders:', error));
}

function toggleAvailability() {
    const riderId = localStorage.getItem('riderId');
    const button = document.getElementById('availabilityButton');

    fetch(`/api/toggle_availability/${riderId}/`, {
        method: 'POST',
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                button.textContent = data.is_available ? 'Mark as Unavailable' : 'Mark as Available';
            }
        })
        .catch(error => console.error('Error toggling availability:', error));
}