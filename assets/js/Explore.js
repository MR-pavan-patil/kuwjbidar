// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

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

// Counter Animation for Hero Stats
const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const isPlus = element.textContent.includes('+');
    const numericTarget = parseInt(target);
    const increment = numericTarget / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= numericTarget) {
            element.textContent = target + (isPlus ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (isPlus ? '+' : '');
        }
    }, 16);
};

// Observe stat numbers for animation
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const text = entry.target.textContent.replace(/[+]/g, '');
            const target = parseInt(text);
            if (!isNaN(target)) {
                animateCounter(entry.target, text);
            }
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

// Parallax Effect for Hero
const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;

        if (scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });
}

// Place Card Hover Effects
const placeCards = document.querySelectorAll('.place-card');
placeCards.forEach(card => {
    const img = card.querySelector('.place-image img');

    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Explore Button Click Animation
const exploreButtons = document.querySelectorAll('.explore-btn');
exploreButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);

        // Placeholder action - can be linked to modal or detail page
        console.log('Explore button clicked for:', this.closest('.place-card').getAttribute('data-place'));
    });

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
});

// Add ripple styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Smooth Scroll for Navigation
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

// Lazy Load Images
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;

            if (!img.complete) {
                img.style.opacity = '0';
                img.addEventListener('load', () => {
                    img.style.transition = 'opacity 0.6s ease';
                    img.style.opacity = '1';
                });
            }

            imageObserver.unobserve(img);
        }
    });
}, {
    rootMargin: '100px'
});

document.querySelectorAll('.place-image img').forEach(img => {
    imageObserver.observe(img);
});

// Enhanced Place Card Animations
const enhancePlaceCards = () => {
    const placeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const image = card.querySelector('.place-image');
                const content = card.querySelector('.place-content');

                // Stagger animation
                setTimeout(() => {
                    image.style.transform = 'translateX(0)';
                    image.style.opacity = '1';
                }, 100);

                setTimeout(() => {
                    content.style.transform = 'translateX(0)';
                    content.style.opacity = '1';
                }, 300);

                placeObserver.unobserve(card);
            }
        });
    }, { threshold: 0.2 });

    placeCards.forEach(card => {
        const image = card.querySelector('.place-image');
        const content = card.querySelector('.place-content');

        // Set initial states
        if (card.classList.contains('place-card-reverse')) {
            image.style.transform = 'translateX(50px)';
            content.style.transform = 'translateX(-50px)';
        } else {
            image.style.transform = 'translateX(-50px)';
            content.style.transform = 'translateX(50px)';
        }

        image.style.opacity = '0';
        content.style.opacity = '0';
        image.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        content.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';

        placeObserver.observe(card);
    });
};

enhancePlaceCards();

// Interactive Highlight Items
document.querySelectorAll('.highlight-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(5px)';
        this.style.borderColor = 'var(--primary-gold)';
    });

    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
        this.style.borderColor = 'var(--glass-border)';
    });

    item.style.transition = 'all 0.3s ease';
});

// Tip Cards Animation
const tipCards = document.querySelectorAll('.tip-card');
tipCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// Map Pins Animation
const mapPins = document.querySelectorAll('.pin-item');
const pinsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            mapPins.forEach((pin, index) => {
                setTimeout(() => {
                    pin.style.opacity = '1';
                    pin.style.transform = 'translateY(0)';
                }, index * 100);
            });
            pinsObserver.disconnect();
        }
    });
}, { threshold: 0.5 });

if (mapPins.length > 0) {
    mapPins.forEach(pin => {
        pin.style.opacity = '0';
        pin.style.transform = 'translateY(20px)';
        pin.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    pinsObserver.observe(document.querySelector('.map-pins'));
}

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        navbar.style.background = 'rgba(10, 10, 15, 0.98)';
        navbar.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Add hover effect to info items
document.querySelectorAll('.info-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        const label = this.querySelector('.info-label');
        label.style.transform = 'scale(1.1)';
    });

    item.addEventListener('mouseleave', function() {
        const label = this.querySelector('.info-label');
        label.style.transform = 'scale(1)';
    });

    const label = item.querySelector('.info-label');
    label.style.transition = 'transform 0.3s ease';
});

// Console Greeting
console.log('%c🏛️ Explore Historic Bidar ', 'background: #D4AF37; color: #0A0A0F; font-size: 18px; padding: 8px; font-weight: bold;');
console.log('%cDiscover 600 years of architectural excellence', 'color: #D4AF37; font-size: 12px;');

// Page Load Animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Image Error Handling
document.querySelectorAll('.place-image img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        const parent = this.closest('.place-image');
        parent.style.background = 'linear-gradient(135deg, var(--dark-card), var(--dark-secondary))';

        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: var(--text-secondary);
            font-size: 4rem;
        `;
        placeholder.innerHTML = '🏛️';
        parent.appendChild(placeholder);
    });
});

// Add subtle parallax to place images
placeCards.forEach(card => {
    const image = card.querySelector('.place-image');

    const parallaxObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                window.addEventListener('scroll', () => {
                    const rect = image.getBoundingClientRect();
                    const scrolled = window.pageYOffset;

                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        const yPos = (rect.top - window.innerHeight / 2) * 0.1;
                        image.style.transform = `translateY(${yPos}px)`;
                    }
                });
            }
        });
    });

    parallaxObserver.observe(image);
});