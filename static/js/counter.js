document.addEventListener("DOMContentLoaded", function () {
    const counters = document.querySelectorAll('.col-md-3 h3 span');
    const targetValues = [150, 10, 500, 1200]; // Example target values
    const duration = 2000; // Animation duration in milliseconds

    counters.forEach((counter, index) => {
        const target = targetValues[index];
        const increment = target / (duration / 16); // 16ms per frame for smooth animation
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    });
});