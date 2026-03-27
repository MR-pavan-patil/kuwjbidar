// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const dropdowns = document.querySelectorAll('.dropdown');

// Notification Banner with Rotating Messages
// const notifications = [
//     "🎉 Early bird registration ends in 3 days! Register now to save 30%",
//     "📢 New keynote speaker announced - Dr. Anjali Sharma joins us!",
//     "🎨 Workshop registrations are now open - Limited seats available",
//     "🏛️ Heritage tour of Bidar Fort included with all passes",
//     "⭐ Special discount for students and cultural organizations"
// ];

let currentNotificationIndex = 0;
const notificationBanner = document.getElementById('notificationBanner');
const notificationText = document.getElementById('notificationText');
const closeNotification = document.getElementById('closeNotification');

// Check if banner was closed in this session
if (notificationBanner && !sessionStorage.getItem('notificationClosed')) {
    notificationBanner.classList.remove('hidden');

    // Rotate messages every 5 seconds
    setInterval(() => {
        currentNotificationIndex = (currentNotificationIndex + 1) % notifications.length;
        notificationText.style.opacity = '0';

        setTimeout(() => {
            notificationText.textContent = notifications[currentNotificationIndex];
            notificationText.style.opacity = '1';
        }, 300);
    }, 5000);

    notificationText.style.transition = 'opacity 0.3s ease';
}

// Close notification
if (closeNotification) {
    closeNotification.addEventListener('click', () => {
        notificationBanner.style.animation = 'slideUp 0.5s ease-out';
        setTimeout(() => {
            notificationBanner.classList.add('hidden');
            sessionStorage.setItem('notificationClosed', 'true');
        }, 500);
    });
}

// Add slideUp animation
const slideUpStyle = document.createElement('style');
slideUpStyle.textContent = `
    @keyframes slideUp {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(-100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(slideUpStyle);

// Toggle mobile menu
mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 968 && link.classList.contains('dropdown-toggle')) {
            e.preventDefault();
            const dropdown = link.closest('.dropdown');
            dropdown.classList.toggle('active');
        } else if (!link.classList.contains('dropdown-toggle')) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            dropdowns.forEach(d => d.classList.remove('active'));
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        dropdowns.forEach(d => d.classList.remove('active'));
    }
});

// --- CONSOLIDATED SCROLL HANDLER ---
// Single scroll listener using requestAnimationFrame for all scroll-dependent logic
const navbar = document.querySelector('.navbar');
const hero = document.querySelector('.hero');
let scrollTicking = false;

function onScroll() {
    const currentScroll = window.pageYOffset;

    // 1. Navbar scroll effect
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // 2. Highlight active navigation
    const scrollPosition = currentScroll + 100;
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navItems.forEach(item => {
                item.classList.remove('active-nav');
                if (item.getAttribute('href') === `#${sectionId}`) {
                    item.classList.add('active-nav');
                }
            });
        }
    });

    // 3. Parallax effect for hero (GPU-friendly transform only)
    if (hero && currentScroll < window.innerHeight) {
        hero.style.transform = `translateY(${currentScroll * 0.5}px)`;
    }

    scrollTicking = false;
}

window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        window.requestAnimationFrame(onScroll);
        scrollTicking = true;
    }
}, { passive: true });

// --- INTERSECTION OBSERVER for scroll animations ---
// Using IntersectionObserver instead of scroll-based checks (much more efficient)
const scrollElements = document.querySelectorAll('.scroll-animate');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

scrollElements.forEach(el => {
    observer.observe(el);
});

// Initial check — trigger for already visible elements
scrollElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
        el.classList.add('active');
        observer.unobserve(el);
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (this.classList.contains('dropdown-toggle')) return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Add stagger animation delay to grid items
const addStaggerDelay = (selector, baseDelay = 100) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        el.style.transitionDelay = `${index * baseDelay}ms`;
    });
};

addStaggerDelay('.highlight-card', 150);
addStaggerDelay('.guest-card', 150);
addStaggerDelay('.bidar-card', 150);
addStaggerDelay('.gallery-item', 100);

// Desktop dropdown hover effect
if (window.innerWidth > 968) {
    dropdowns.forEach(dropdown => {
        let timeout;

        dropdown.addEventListener('mouseenter', () => {
            clearTimeout(timeout);
            dropdown.classList.add('active');
        });

        dropdown.addEventListener('mouseleave', () => {
            timeout = setTimeout(() => {
                dropdown.classList.remove('active');
            }, 100);
        });
    });
}

// Counter animation for stats
const statNumbers = document.querySelectorAll('.stat-number');
if (statNumbers.length) {
    const animateCounter = (element, target, duration = 2000) => {
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, 16);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target.textContent.replace('+', '');
                animateCounter(entry.target, parseInt(target));
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));
}

// Gallery item hover effect
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    item.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// Ripple effect on CTA buttons
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
    setTimeout(() => ripple.remove(), 600);
};

const ctaButtons = document.querySelectorAll('.hero-cta, .cta-button, .nav-cta');
ctaButtons.forEach(button => {
    button.addEventListener('click', addRippleEffect);
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
});

// Scroll to top button
const createScrollTopButton = () => {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
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
        transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
        z-index: 999;
        box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
    `;

    document.body.appendChild(scrollTopBtn);

    // Visibility handled inside the consolidated scroll handler would be ideal,
    // but keeping it here for modularity — it uses the passive scroll listener
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

// Add loading class on page load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});