function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 24.6637, lng: 68.8369 }, // Coordinates for Badin, Pakistan
        zoom: 12,
    });

    // Add a marker for Badin
    new google.maps.Marker({
        position: { lat: 24.6637, lng: 68.8369 },
        map: map,
        title: 'Badin, Pakistan',
    });
}