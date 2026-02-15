// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Tour button handler
document.addEventListener('DOMContentLoaded', function() {
    const tourBtn = document.querySelector('.btn-primary');
    if (tourBtn) {
        tourBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Thank you for your interest! Please contact us to schedule a tour.');
        });
    }
});
