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

    // Keep the original Salesforce markup so switching back restores it exactly.
    const zohoContent = {
        '.hero-content > .eyebrow': 'Zoho Developer | Bengaluru, India',
        '.hero-content h1': 'Building Zoho solutions that simplify everyday work.',
        '.hero-summary': 'I build dynamic widgets, Creator applications, and Deluge automations, connecting Zoho with third-party platforms to turn complex processes into user-friendly tools.',
        '.hero-stats': '<div class="stat"><strong>100K+</strong><span>Records supported by a Creator import app</span></div><div class="stat"><strong>Widgets</strong><span>Dynamic Zoho experiences</span></div><div class="stat"><strong>Deluge</strong><span>Custom workflow automation</span></div>',
        '#about .section-heading h2': 'Built for your business.<br>Connected through Zoho.',
        '#about .about-text': '<p class="lead">I specialize in dynamic Zoho widgets, Deluge scripting, and custom applications that make everyday business processes easier.</p><p>My work spans Zoho CRM customization, Creator development, workflow automation, and integrations with third-party applications through REST APIs and webhooks.</p><p>I have built a Creator application that can import more than 100,000 records, with a focus on practical tools, data accuracy, and reliable delivery.</p>',
        '#experience > .container > .section-title h2': 'My Zoho experience.',
        '#experience > .container > .section-title > p:last-child': 'Dynamic widgets, custom applications, and connected workflows across the Zoho ecosystem.',
        '#expertise .section-title h2': 'What I build with Zoho',
        '#expertise .expertise-grid': [
            ['Dynamic widgets', 'Interactive Zoho widgets tailored to business workflows and user needs.', 'code'],
            ['Creator applications', 'Custom business applications, including an import tool supporting more than 100,000 records.', 'layer-group'],
            ['Deluge automation', 'Custom functions and workflow scripts that reduce repetitive work.', 'gears'],
            ['Connected systems', 'REST APIs and webhooks connecting Zoho with third-party applications.', 'plug']
        ].map(([title, copy, icon], i) => `<article class="expertise-card"><span class="card-number">0${i + 1}</span><i class="fas fa-${icon}" aria-hidden="true"></i><h3>${title}</h3><p>${copy}</p></article>`).join(''),
        '#projects .section-title h2': 'Zoho solutions I have built',
        '#projects .projects-grid': [
            ['Creator development', 'Large-volume record imports', 'A Zoho Creator application capable of importing more than 100,000 records to support business data workflows.', ['Zoho Creator', 'Data imports']],
            ['Widget development', 'Dynamic Zoho widgets', 'Custom widgets that bring interactive, user-friendly experiences into Zoho workflows.', ['Widgets', 'Zoho CRM']],
            ['Integration & automation', 'Connected business workflows', 'Deluge automation and integrations linking Zoho with third-party applications through REST APIs and webhooks.', ['Deluge', 'REST APIs', 'Webhooks']]
        ].map(([label, title, copy, tags]) => `<article class="project-card"><div class="project-top"><span>${label}</span></div><h3>${title}</h3><p>${copy}</p><div class="tech-stack">${tags.map(tag => `<span>${tag}</span>`).join('')}</div></article>`).join(''),
        '#skills .section-heading h2': 'My Zoho development toolkit',
        '#skills .section-heading > p:last-child': 'From custom interfaces and applications to automation, integrations, and data management.',
        '#skills .skills-container': [
            ['Applications', ['Zoho CRM', 'Zoho Creator', 'Zoho Books', 'Zoho Desk', 'Zoho Forms', 'Zoho Flow']],
            ['Development & integration', ['Dynamic widgets', 'Deluge', 'Custom functions', 'REST APIs', 'Webhooks']],
            ['Configuration & delivery', ['Blueprint', 'Approval processes', 'Validation rules', 'Data migration', 'Reports & dashboards', 'Testing & support']]
        ].map(([title, tags]) => `<div class="skills-category"><h3>${title}</h3><ul class="skills-list">${tags.map(tag => `<li>${tag}</li>`).join('')}</ul></div>`).join(''),
        '#contact .contact-card > div:first-child > p:last-child': 'Let&#39;s discuss Zoho widgets, Creator applications, Deluge automation, and integrations for your business.'
    };
    const platformContent = Object.entries(zohoContent).map(([selector, zoho]) => {
        const element = document.querySelector(selector);
        return { element, zoho, salesforce: element.innerHTML };
    });
    const originalTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const originalDescription = description.content;
    const applyPortfolioTheme = (isZoho) => {
        document.body.classList.toggle('zoho-mode', isZoho);
        platformContent.forEach(({ element, zoho, salesforce }) => { element.innerHTML = isZoho ? zoho : salesforce; });
        document.querySelectorAll('.role-card, a[download], #education-achievements').forEach(element => { element.hidden = isZoho; });
        document.title = isZoho ? 'Mayank Anand | Zoho Developer' : originalTitle;
        description.content = isZoho ? 'Mayank Anand builds dynamic Zoho widgets, Creator applications, Deluge automations, and third-party integrations.' : originalDescription;
        document.querySelector('meta[name="theme-color"]').content = isZoho ? '#bc2724' : '#0176d3';
    };

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
        applyPortfolioTheme(selectedTab.dataset.platform === 'zoho');
        if (focus) selectedTab.focus();
    };
    experienceToggle?.addEventListener('click', () => {
        const showZoho = experienceToggle.getAttribute('aria-checked') !== 'true';
        selectPlatform(document.getElementById(showZoho ? 'platform-zoho' : 'platform-salesforce'));
        closeMenu();
        history.replaceState(null, '', showZoho ? '#zoho' : '#experience');
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
