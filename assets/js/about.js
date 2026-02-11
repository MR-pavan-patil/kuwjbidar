// Smooth Scroll Animation Observer
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

// Add stagger delay to elements in the same section
const addStaggerDelay = (selector, baseDelay = 150) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        el.style.transitionDelay = `${index * baseDelay}ms`;
    });
};

// Apply stagger animations
addStaggerDelay('.special-card', 100);
addStaggerDelay('.team-card', 120);
addStaggerDelay('.timeline-item', 150);
addStaggerDelay('.vm-card', 200);

// Parallax Effect for Hero Section
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

// Counter Animation for Stats
const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString() + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString() + '+';
        }
    }, 16);
};

// Observe stat numbers for animation
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const text = entry.target.textContent.replace(/[+,]/g, '');
            const target = parseInt(text);
            if (!isNaN(target)) {
                animateCounter(entry.target, target);
            }
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

// Timeline Animation Enhancement
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
        }
    });
}, { threshold: 0.3 });

timelineItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-50px)';
    item.style.transition = 'all 0.8s ease';
    timelineObserver.observe(item);
});

// Smooth Scroll for Navigation Links
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

// Add hover effect to team cards
const teamCards = document.querySelectorAll('.team-card');
teamCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });

    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// Partner boxes animation on hover
const partnerBoxes = document.querySelectorAll('.partner-box');
partnerBoxes.forEach(box => {
    box.addEventListener('mouseenter', function() {
        // Add pulse effect
        this.style.animation = 'pulse 0.5s ease';
    });

    box.addEventListener('mouseleave', function() {
        this.style.animation = '';
    });
});

// Add pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);

// Scroll Progress Indicator
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

// Image Lazy Loading Enhancement
const images = document.querySelectorAll('img');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.6s ease';

            img.onload = () => {
                img.style.opacity = '1';
            };

            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => {
    imageObserver.observe(img);
});

// Add ripple effect to CTA buttons
const addRippleEffect = (e) => {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
};

const ctaButtons = document.querySelectorAll('.cta-button, .nav-cta');
ctaButtons.forEach(button => {
    button.addEventListener('click', addRippleEffect);
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

// Enhanced Story Section Animation
const storyText = document.querySelector('.story-text');
const storyImage = document.querySelector('.story-image');

if (storyText && storyImage) {
    const storyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target === storyText) {
                    entry.target.style.transform = 'translateX(0)';
                    entry.target.style.opacity = '1';
                } else if (entry.target === storyImage) {
                    entry.target.style.transform = 'translateX(0)';
                    entry.target.style.opacity = '1';
                }
            }
        });
    }, { threshold: 0.2 });

    storyText.style.transform = 'translateX(-50px)';
    storyText.style.opacity = '0';
    storyText.style.transition = 'all 1s ease';

    storyImage.style.transform = 'translateX(50px)';
    storyImage.style.opacity = '0';
    storyImage.style.transition = 'all 1s ease 0.2s';

    storyObserver.observe(storyText);
    storyObserver.observe(storyImage);
}

// Add subtle parallax to section backgrounds
const sections = document.querySelectorAll('section');
window.addEventListener('scroll', () => {
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const scrolled = window.pageYOffset;

        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const yPos = -(rect.top * 0.1);
            section.style.backgroundPosition = `center ${yPos}px`;
        }
    });
});

// Badge animation on scroll
const badges = document.querySelectorAll('.badge-item');
const badgeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1) translateY(0)';
            }, index * 150);
            badgeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

badges.forEach(badge => {
    badge.style.opacity = '0';
    badge.style.transform = 'scale(0.8) translateY(20px)';
    badge.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    badgeObserver.observe(badge);
});

// Console greeting
console.log('%c🏛️ Bidar Cultural Summit 2026 ', 'background: #D4AF37; color: #0A0A0F; font-size: 20px; padding: 10px; font-weight: bold;');
console.log('%cPreserving Heritage, Inspiring Innovation', 'color: #D4AF37; font-size: 14px;');

// Page load animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});