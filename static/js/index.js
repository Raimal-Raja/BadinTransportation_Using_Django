// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Example: Add a simple animation to the hero section
const hero = document.querySelector('.hero');
hero.style.opacity = '0';
setTimeout(() => {
    hero.style.transition = 'opacity 2s';
    hero.style.opacity = '1';
}, 500);