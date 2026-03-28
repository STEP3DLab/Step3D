document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
  }

  const progress = document.getElementById('scrollProgress');
  const links = [...document.querySelectorAll('.nav a')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const update = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${h > 0 ? window.scrollY / h * 100 : 0}%`;
    let active = '';
    sections.forEach((s) => { if (s.getBoundingClientRect().top <= 140) active = s.id; });
    links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${active}`));
  };
  window.addEventListener('scroll', update, { passive: true });
  update();

  document.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-btn');
    btn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item').forEach((x) => {
        x.classList.remove('is-open');
        x.querySelector('.faq-btn')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
});
