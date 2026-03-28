export function initNav() {
  const scrollProgress = document.getElementById('scrollProgress');
  const sectionIds = ['top', 'story', 'services', 'model', 'workflow', 'estimate', 'cases', 'compare', 'faq', 'contact'];
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const navMenu = document.getElementById('siteNav');
  const navToggle = document.getElementById('navToggle');
  const railLinks = [...document.querySelectorAll('.rail-link')];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

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

  const closeMobileNav = () => {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const shouldOpen = !navMenu.classList.contains('is-open');
      navMenu.classList.toggle('is-open', shouldOpen);
      navToggle.classList.toggle('is-open', shouldOpen);
      navToggle.setAttribute('aria-expanded', String(shouldOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', closeMobileNav);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) closeMobileNav();
    });
  }

  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
    { threshold: 0.16 }
  );
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}
