function setMenuState(toggleButton, isOpen) {
  document.body.classList.toggle('nav-open', isOpen);
  if (toggleButton) {
    toggleButton.setAttribute('aria-expanded', String(isOpen));
    toggleButton.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  }
}

export function initNav() {
  const scrollProgress = document.getElementById('scrollProgress');
  const sectionIds = ['top', 'story', 'services', 'model', 'workflow', 'estimate', 'cases', 'compare', 'faq', 'contact'];
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const railLinks = [...document.querySelectorAll('.rail-link')];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  const navToggle = document.getElementById('navToggle');

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

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      setMenuState(navToggle, !isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => setMenuState(navToggle, false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMenuState(navToggle, false);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
    { threshold: 0.16 }
  );
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}
