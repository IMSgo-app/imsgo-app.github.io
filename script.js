const yearTarget = document.querySelector('#year');
const revealNodes = document.querySelectorAll('.reveal');
const topbar = document.querySelector('.topbar');
const menuToggle = document.querySelector('.menu-toggle');

if (yearTarget) {
    yearTarget.textContent = String(new Date().getFullYear());
}

revealNodes.forEach((node) => node.classList.add('is-visible'));

if (topbar && menuToggle) {
    const closeMenu = () => {
        topbar.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
    };

    menuToggle.addEventListener('click', () => {
        const shouldOpen = !topbar.classList.contains('menu-open');

        topbar.classList.toggle('menu-open', shouldOpen);
        menuToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    });

    topbar.querySelectorAll('.nav-links a, .nav-link').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (event) => {
        if (!topbar.contains(event.target)) {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 760) {
            closeMenu();
        }
    });
}