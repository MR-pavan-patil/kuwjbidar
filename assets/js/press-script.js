const mobileMenuBtn = document.querySelector('.mobile-menu-btn'),
    navLinks = document.querySelector('.nav-links');
mobileMenuBtn && (mobileMenuBtn.addEventListener('click', () => { mobileMenuBtn.classList.toggle('active'), navLinks.classList.toggle('active') }), document.querySelectorAll('.nav-links a').forEach(e => { e.addEventListener('click', () => { mobileMenuBtn.classList.remove('active'), navLinks.classList.remove('active') }) }));
const filterButtons = document.querySelectorAll('.filter-btn'),
    pressCards = document.querySelectorAll('.press-card');
filterButtons.forEach(e => { e.addEventListener('click', () => { filterButtons.forEach(e => e.classList.remove('active')), e.classList.add('active'); const t = e.getAttribute('data-filter');
        pressCards.forEach((e, a) => { const s = e.getAttribute('data-category'); 'all' === t || s === t ? setTimeout(() => { e.classList.remove('hidden'), setTimeout(() => { e.style.opacity = '1', e.style.transform = 'translateY(0)' }, 10) }, 50 * a) : (e.style.opacity = '0', e.style.transform = 'translateY(20px)', setTimeout(() => { e.classList.add('hidden') }, 300)) }) }) });
const modal = document.getElementById('pressModal'),
    modalImage = document.getElementById('modalImage'),
    modalTitle = document.getElementById('modalTitle'),
    modalDate = document.getElementById('modalDate'),
    modalClose = document.querySelector('.modal-close');
document.querySelectorAll('.view-btn').forEach(e => { e.addEventListener('click', t => { t.stopPropagation(); const a = e.closest('.press-card'),
            s = a.querySelector('.press-image img').src,
            l = a.querySelector('.press-title').textContent,
            c = a.querySelector('.press-date').textContent;
        modalImage.src = s, modalTitle.textContent = l, modalDate.textContent = c, modal.classList.add('active'), document.body.style.overflow = 'hidden' }) }), modalClose.addEventListener('click', () => { modal.classList.remove('active'), document.body.style.overflow = 'auto' }), modal.addEventListener('click', e => { e.target === modal && (modal.classList.remove('active'), document.body.style.overflow = 'auto') });
const observerOptions = { threshold: .1, rootMargin: '0px 0px -100px 0px' },
    fadeInObserver = new IntersectionObserver(e => { e.forEach(e => { e.isIntersecting && (e.target.classList.add('active'), fadeInObserver.unobserve(e.target)) }) }, observerOptions);
document.querySelectorAll('.fade-in').forEach(e => { fadeInObserver.observe(e) });
const createScrollProgress = () => { const e = document.createElement('div');
    e.style.cssText = 'position: fixed; top: 0; left: 0; height: 4px; background: linear-gradient(90deg, var(--primary-gold), var(--gold-light)); width: 0%; z-index: 9999; transition: width 0.1s ease;', document.body.appendChild(e), window.addEventListener('scroll', () => { const t = (100 * window.pageYOffset) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
        e.style.width = t + '%' }) };
createScrollProgress();
const createScrollTopButton = () => { const e = document.createElement('button');
    e.innerHTML = '↑', e.className = 'scroll-top-btn', e.style.cssText = 'position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, var(--primary-gold), var(--gold-dark)); color: var(--dark-bg); border: none; font-size: 1.5rem; cursor: pointer; opacity: 0; visibility: hidden; transition: all 0.3s ease; z-index: 999; box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);', document.body.appendChild(e), window.addEventListener('scroll', () => { window.pageYOffset > 500 ? (e.style.opacity = '1', e.style.visibility = 'visible') : (e.style.opacity = '0', e.style.visibility = 'hidden') }), e.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }) }), e.addEventListener('mouseenter', function() { this.style.transform = 'translateY(-5px)', this.style.boxShadow = '0 8px 30px rgba(212, 175, 55, 0.5)' }), e.addEventListener('mouseleave', function() { this.style.transform = 'translateY(0)', this.style.boxShadow = '0 5px 20px rgba(212, 175, 55, 0.3)' }) };
createScrollTopButton(), window.addEventListener('load', () => { document.body.style.opacity = '0', document.body.style.transition = 'opacity 0.5s ease', setTimeout(() => { document.body.style.opacity = '1' }, 100) });