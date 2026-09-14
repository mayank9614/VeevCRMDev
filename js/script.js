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

    const platformTabs = [...document.querySelectorAll('[data-platform]')];
    const experienceToggle = document.getElementById('experience-toggle');
    const selectPlatform = (selectedTab, focus = false) => {
        platformTabs.forEach((tab) => {
            const selected = tab === selectedTab;
            tab.classList.toggle('active', selected);
            tab.setAttribute('aria-selected', String(selected));
            tab.tabIndex = selected ? 0 : -1;
            document.getElementById(tab.dataset.platform).hidden = !selected;
        });
        document.querySelector('#experience').classList.toggle('zoho-selected', selectedTab.dataset.platform === 'zoho');
        experienceToggle?.setAttribute('aria-checked', String(selectedTab.dataset.platform === 'zoho'));
        if (focus) selectedTab.focus();
    };
    experienceToggle?.addEventListener('click', () => {
        const showZoho = experienceToggle.getAttribute('aria-checked') !== 'true';
        selectPlatform(document.getElementById(showZoho ? 'platform-zoho' : 'platform-salesforce'));
        closeMenu();
        history.replaceState(null, '', showZoho ? '#zoho' : '#experience');
        document.getElementById('experience').scrollIntoView({ block: 'start' });
    });
    platformTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => selectPlatform(tab));
        tab.addEventListener('keydown', (event) => {
            let next;
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = 1 - index;
            if (event.key === 'Home') next = 0;
            if (event.key === 'End') next = platformTabs.length - 1;
            if (next === undefined) return;
            event.preventDefault();
            selectPlatform(platformTabs[next], true);
        });
    });
    const openZohoLink = () => {
        if (window.location.hash !== '#zoho') return;
        selectPlatform(document.getElementById('platform-zoho'));
        document.getElementById('experience').scrollIntoView({ block: 'start' });
    };
    document.querySelector('a[href="#zoho"]')?.addEventListener('click', () => {
        selectPlatform(document.getElementById('platform-zoho'));
    });
    window.addEventListener('hashchange', openZohoLink);
    openZohoLink();

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 800) closeMenu();
    });

    const careerTabs = [...document.querySelectorAll('[data-career-target]')];
    const careerPanels = [...document.querySelectorAll('.career-panel')];

    const showCareerChapter = (selectedTab, moveFocus = false) => {
        const targetId = selectedTab?.dataset.careerTarget;
        if (!targetId) return;

        careerTabs.forEach((tab) => {
            const isSelected = tab === selectedTab;
            tab.classList.toggle('active', isSelected);
            tab.setAttribute('aria-selected', String(isSelected));
            tab.setAttribute('tabindex', isSelected ? '0' : '-1');
        });

        careerPanels.forEach((panel) => {
            const isSelected = panel.id === targetId;
            panel.hidden = !isSelected;
            panel.classList.toggle('active', isSelected);
        });

        if (moveFocus) {
            selectedTab.focus();
            selectedTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    };

    careerTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => showCareerChapter(tab));
        tab.addEventListener('keydown', (event) => {
            let nextIndex;

            if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (index + 1) % careerTabs.length;
            if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (index - 1 + careerTabs.length) % careerTabs.length;
            if (event.key === 'Home') nextIndex = 0;
            if (event.key === 'End') nextIndex = careerTabs.length - 1;
            if (nextIndex === undefined) return;

            event.preventDefault();
            showCareerChapter(careerTabs[nextIndex], true);
        });
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
        '.career-explorer, .expertise-card, .project-card, .skills-category, .panel, .interest-card'
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
