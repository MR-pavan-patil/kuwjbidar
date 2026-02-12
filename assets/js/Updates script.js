// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const updateCards = document.querySelectorAll('.update-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        // Filter update cards
        updateCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');

            if (filterValue === 'all' || category === filterValue) {
                setTimeout(() => {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                }, index * 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.classList.add('hidden');
                }, 300);
            }
        });
    });
});

// Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all fade-in elements
const fadeElements = document.querySelectorAll('.fade-in');
fadeElements.forEach(el => {
    fadeInObserver.observe(el);
});

// Newsletter Form Handling
const newsletterForm = document.querySelector('.newsletter-form');
const newsletterInput = document.querySelector('.newsletter-input');
const newsletterBtn = document.querySelector('.newsletter-btn');

if (newsletterBtn) {
    newsletterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = newsletterInput.value.trim();

        if (email && validateEmail(email)) {
            // Show success message
            newsletterBtn.textContent = '✓ Subscribed!';
            newsletterBtn.style.background = 'linear-gradient(135deg, #51cf66, #2d9e4d)';
            newsletterInput.value = '';

            setTimeout(() => {
                newsletterBtn.textContent = 'Subscribe';
                newsletterBtn.style.background = 'linear-gradient(135deg, var(--primary-gold), var(--gold-dark))';
            }, 3000);
        } else {
            // Show error
            newsletterInput.style.borderColor = '#ff6b6b';
            setTimeout(() => {
                newsletterInput.style.borderColor = 'var(--glass-border)';
            }, 2000);
        }
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Progress Bar
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--primary-gold), var(--gold-light));
        width: 0%;
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
};

createScrollProgress();

// Scroll to Top Button
const createScrollTopButton = () => {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary-gold), var(--gold-dark));
        color: var(--dark-bg);
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
    `;

    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 8px 30px rgba(212, 175, 55, 0.5)';
    });

    scrollTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 5px 20px rgba(212, 175, 55, 0.3)';
    });
};

createScrollTopButton();

// Add stagger delay to update cards
const addStaggerDelay = (selector, baseDelay = 100) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        el.style.transitionDelay = `${index * baseDelay}ms`;
    });
};

addStaggerDelay('.update-card', 100);

// Page Load Animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Console Greeting
console.log('%c📰 Updates & News ', 'background: #D4AF37; color: #0A0A0F; font-size: 16px; padding: 8px; font-weight: bold;');
console.log('%cBidar Cultural Summit 2026', 'color: #D4AF37; font-size: 12px;');