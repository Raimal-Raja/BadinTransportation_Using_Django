document.addEventListener("DOMContentLoaded", function () {
    const riderId = localStorage.getItem('rider_id'); // Use 'rider_id'
    console.log('Retrieved Rider ID:', riderId); // Debug: Log the retrieved rider ID

    if (!riderId) {
        console.log('No Rider ID Found, Redirecting to Login'); // Debug: Log redirection
        window.location.href = '/login/';
    }

    fetchOrders(riderId);
});

function fetchOrders(riderId) {
    console.log('Fetching Orders for Rider ID:', riderId); // Debug: Log the rider ID
    fetch(`/api/orders/${riderId}/`)
        .then(response => response.json())
        .then(data => {
            console.log('Orders Data:', data); // Debug: Log the orders data
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