function getFocusableElements(container) {
  if (!container) return [];
  return [...container.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter(
    (el) => !el.hasAttribute('hidden') && !el.getAttribute('aria-hidden')
  );
}

function setMenuState(toggleButton, isOpen, { nav, navLinks, restoreFocus = true } = {}) {
  document.body.classList.toggle('nav-open', isOpen);
  if (toggleButton) {
    toggleButton.setAttribute('aria-expanded', String(isOpen));
    toggleButton.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  }

  if (nav) {
    nav.setAttribute('aria-hidden', String(!isOpen));
  }

  navLinks?.forEach((link) => {
    if (window.matchMedia('(max-width: 960px)').matches) {
      link.tabIndex = isOpen ? 0 : -1;
    } else {
      link.removeAttribute('tabindex');
    }
  });

  if (isOpen) {
    const firstLink = navLinks?.[0];
    firstLink?.focus();
    return;
  }

  if (restoreFocus) {
    toggleButton?.focus();
  }
}

export function initNav() {
  const scrollProgress = document.getElementById('scrollProgress');
  const sectionIds = ['top', 'story', 'services', 'model', 'workflow', 'estimate', 'cases', 'compare', 'faq', 'contact'];
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const railLinks = [...document.querySelectorAll('.rail-link')];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');

  const setActiveNav = (targetId) => {
    navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${targetId}`));
    railLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${targetId}`));
  };

  const onScroll = () => {
    if (scrollProgress) {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
      scrollProgress.style.width = `${progress}%`;
    }

    let current = 'top';
    const offset = window.innerHeight * 0.24;
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= offset) current = section.id;
    });
    setActiveNav(current);
  };

  let isTicking = false;
  const requestScrollUpdate = () => {
    if (isTicking) return;
    isTicking = true;
    window.requestAnimationFrame(() => {
      onScroll();
      isTicking = false;
    });
  };

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  onScroll();

  if (navToggle) {
    const syncMobileMenuTabOrder = () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      setMenuState(navToggle, isOpen, { nav, navLinks, restoreFocus: false });
    };

    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      setMenuState(navToggle, !isOpen, { nav, navLinks });
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => setMenuState(navToggle, false, { nav, navLinks, restoreFocus: false }));
    });

    document.addEventListener('click', (event) => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      if (!isOpen) return;
      const insideMenu = nav?.contains(event.target);
      const insideToggle = navToggle.contains(event.target);
      if (!insideMenu && !insideToggle) {
        setMenuState(navToggle, false, { nav, navLinks, restoreFocus: false });
      }
    });

    document.addEventListener('keydown', (event) => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';

      if (event.key === 'Escape') {
        setMenuState(navToggle, false, { nav, navLinks });
      }

      if (!isOpen || event.key !== 'Tab') return;
      const focusable = getFocusableElements(nav);
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener('resize', syncMobileMenuTabOrder, { passive: true });
    syncMobileMenuTabOrder();
  }

  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
    { threshold: 0.16 }
  );
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}
