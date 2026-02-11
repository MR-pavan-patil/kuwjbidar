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

// Gallery Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        // Filter gallery items with animation
        galleryItems.forEach((item, index) => {
            const category = item.getAttribute('data-category');

            if (filterValue === 'all' || category === filterValue) {
                setTimeout(() => {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                }, index * 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Modal Lightbox Functionality
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalCounter = document.getElementById('modalCounter');
const modalClose = document.querySelector('.modal-close');
const modalPrev = document.querySelector('.modal-prev');
const modalNext = document.querySelector('.modal-next');

let currentImageIndex = 0;
let visibleImages = [];

// Get all visible images
function updateVisibleImages() {
    visibleImages = Array.from(galleryItems).filter(item => {
        return window.getComputedStyle(item).display !== 'none';
    });
}

// Open modal
function openModal(index) {
    updateVisibleImages();
    currentImageIndex = index;
    showImage(currentImageIndex);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Show specific image
function showImage(index) {
    if (index < 0) {
        currentImageIndex = visibleImages.length - 1;
    } else if (index >= visibleImages.length) {
        currentImageIndex = 0;
    } else {
        currentImageIndex = index;
    }

    const item = visibleImages[currentImageIndex];
    const img = item.querySelector('img');
    const info = item.querySelector('.gallery-info');

    modalImage.src = img.src;
    modalImage.alt = img.alt;
    modalTitle.textContent = info.querySelector('h3').textContent;
    modalCategory.textContent = info.querySelector('p').textContent;
    modalCounter.textContent = `${currentImageIndex + 1} / ${visibleImages.length}`;
}

// Navigate to previous image
function prevImage() {
    showImage(currentImageIndex - 1);
}

// Navigate to next image
function nextImage() {
    showImage(currentImageIndex + 1);
}

// Add click event to all gallery items
galleryItems.forEach((item, index) => {
    const viewBtn = item.querySelector('.view-btn');

    viewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateVisibleImages();
        const visibleIndex = visibleImages.indexOf(item);
        openModal(visibleIndex);
    });

    // Also open on image click
    item.addEventListener('click', () => {
        updateVisibleImages();
        const visibleIndex = visibleImages.indexOf(item);
        openModal(visibleIndex);
    });
});

// Modal controls
modalClose.addEventListener('click', closeModal);
modalPrev.addEventListener('click', prevImage);
modalNext.addEventListener('click', nextImage);

// Close modal when clicking outside image
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;

    if (e.key === 'Escape') {
        closeModal();
    } else if (e.key === 'ArrowLeft') {
        prevImage();
    } else if (e.key === 'ArrowRight') {
        nextImage();
    }
});

// Swipe functionality for mobile
let touchStartX = 0;
let touchEndX = 0;

modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

modal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;

    if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left - next image
        nextImage();
    }

    if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right - previous image
        prevImage();
    }
}

// Lazy Loading Images
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('src');

            if (!img.complete) {
                img.style.opacity = '0';
                img.addEventListener('load', () => {
                    img.style.transition = 'opacity 0.5s ease';
                    img.style.opacity = '1';
                });
            }

            imageObserver.unobserve(img);
        }
    });
}, {
    rootMargin: '100px'
});

// Observe all images
document.querySelectorAll('.gallery-item img').forEach(img => {
    imageObserver.observe(img);
});

// Load More Functionality
const loadMoreBtn = document.querySelector('.load-more-btn');
let itemsToShow = 12;
let currentlyShowing = 12;

// Initially hide items beyond the first set
function initializeGallery() {
    const allItems = Array.from(galleryItems);
    allItems.forEach((item, index) => {
        if (index >= itemsToShow) {
            item.classList.add('hidden');
        }
    });

    // Hide button if all items are visible
    if (allItems.length <= itemsToShow) {
        loadMoreBtn.classList.add('hidden');
    }
}

// Load more items
loadMoreBtn.addEventListener('click', () => {
    const hiddenItems = Array.from(galleryItems).filter(item =>
        item.classList.contains('hidden')
    );

    const itemsToLoad = hiddenItems.slice(0, 6);

    itemsToLoad.forEach((item, index) => {
        setTimeout(() => {
            item.classList.remove('hidden');
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';

            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 10);
        }, index * 100);
    });

    currentlyShowing += itemsToLoad.length;

    // Hide button if no more items
    if (hiddenItems.length <= 6) {
        setTimeout(() => {
            loadMoreBtn.classList.add('hidden');
        }, 600);
    }
});

// Initialize gallery on load
initializeGallery();

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Set initial state and observe
galleryItems.forEach((item, index) => {
    if (!item.classList.contains('hidden')) {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `all 0.6s ease ${index * 0.05}s`;
        fadeInObserver.observe(item);
    }
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

// Image Error Handling
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        const parent = this.closest('.gallery-item');
        parent.style.background = 'linear-gradient(135deg, var(--dark-card), var(--dark-secondary))';

        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: var(--text-secondary);
        `;
        placeholder.innerHTML = '📷<br>Image Unavailable';
        parent.appendChild(placeholder);
    });
});

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

// Dynamic Grid Layout Adjustment
function adjustGridLayout() {
    const gridWidth = document.querySelector('.gallery-grid').offsetWidth;
    const itemWidth = 300;
    const gap = 32; // 2rem
    const columns = Math.floor((gridWidth + gap) / (itemWidth + gap));

    // Optional: Adjust grid for perfect fit
    // This can be used for more advanced layouts
}

window.addEventListener('resize', adjustGridLayout);
adjustGridLayout();

// Console Greeting
console.log('%c📸 Gallery Loaded ', 'background: #D4AF37; color: #0A0A0F; font-size: 16px; padding: 8px; font-weight: bold;');
console.log('%cBidar Cultural Summit 2026', 'color: #D4AF37; font-size: 12px;');

// Performance: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll-heavy operations
const debouncedScroll = debounce(() => {
    // Any scroll-heavy operations here
}, 100);

window.addEventListener('scroll', debouncedScroll);

// Page Load Animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Preload next/previous images in modal for smooth transitions
function preloadAdjacentImages() {
    if (visibleImages.length === 0) return;

    const prevIndex = currentImageIndex === 0 ? visibleImages.length - 1 : currentImageIndex - 1;
    const nextIndex = currentImageIndex === visibleImages.length - 1 ? 0 : currentImageIndex + 1;

    [prevIndex, nextIndex].forEach(index => {
        const img = new Image();
        const src = visibleImages[index].querySelector('img').src;
        img.src = src;
    });
}

// Call preload when modal opens or image changes
document.addEventListener('modalImageChanged', preloadAdjacentImages);