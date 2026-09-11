document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = [...document.querySelectorAll('.nav-links a')];

    const closeMenu = () => {
        if (!hamburger || !navLinks) return;
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open navigation menu');
        document.body.classList.remove('menu-open');
    };

    hamburger?.addEventListener('click', () => {
        const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.classList.toggle('active', !isOpen);
        navLinks?.classList.toggle('active', !isOpen);
        hamburger.setAttribute('aria-expanded', String(!isOpen));
        hamburger.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
        document.body.classList.toggle('menu-open', !isOpen);
    });

    navItems.forEach((item) => item.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 800) closeMenu();
    });

    const scrollTopButton = document.createElement('button');
    scrollTopButton.className = 'scroll-top-btn';
    scrollTopButton.type = 'button';
    scrollTopButton.setAttribute('aria-label', 'Scroll to top');
    scrollTopButton.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
    document.body.appendChild(scrollTopButton);

    const updateScrollButton = () => {
        scrollTopButton.classList.toggle('show', window.scrollY > 500);
    };

    window.addEventListener('scroll', updateScrollButton, { passive: true });
    updateScrollButton();

    scrollTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const revealElements = document.querySelectorAll(
        '.timeline-item, .expertise-card, .project-card, .skills-category, .panel, .interest-card'
    );

    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        revealElements.forEach((element) => element.classList.add('reveal'));

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -35px' });

        revealElements.forEach((element) => revealObserver.observe(element));
    }

    const sections = [...document.querySelectorAll('main section[id]')];

    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            const visibleSection = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (!visibleSection) return;
            const currentId = visibleSection.target.id;
            navItems.forEach((item) => {
                const isCurrent = item.getAttribute('href') === `#${currentId}`;
                item.classList.toggle('active', isCurrent);
                if (isCurrent) item.setAttribute('aria-current', 'page');
                else item.removeAttribute('aria-current');
            });
        }, { threshold: [0.2, 0.45], rootMargin: '-80px 0px -45% 0px' });

        sections.forEach((section) => sectionObserver.observe(section));
    }

    const year = document.querySelector('#current-year');
    if (year) year.textContent = String(new Date().getFullYear());
});
