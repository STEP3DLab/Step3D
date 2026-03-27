const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

const toastEl = qs('#toast');
const showToast = (text) => {
  if (!toastEl) return;
  toastEl.textContent = text;
  toastEl.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toastEl.classList.remove('show'), 2300);
};

const menuToggle = qs('#menuToggle');
const mainNav = qs('#mainNav');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const opened = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(opened));
  });

  qsa('a', mainNav).forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const progressBar = qs('#scrollProgressBar');
const sections = qsa('main section[id]');
const navLinks = qsa('.main-nav a[href^="#"]');

const updateScrollState = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
  if (progressBar) progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;

  let activeId = '';
  for (const section of sections) {
    if (window.scrollY >= section.offsetTop - 160) activeId = section.id;
  }

  navLinks.forEach((link) => {
    const href = link.getAttribute('href')?.replace('#', '');
    link.classList.toggle('active', href === activeId);
  });
};

window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();

const revealItems = qsa('.reveal');
if ('IntersectionObserver' in window && revealItems.length > 0) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -5% 0px' });

  revealItems.forEach((item, idx) => {
    item.style.transitionDelay = `${Math.min(0.28, idx * 0.03)}s`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add('in-view'));
}

const estimateForm = qs('#estimateForm');
const estimateResult = qs('#estimateResult');
const basePrice = {
  scan: 12000,
  reverse: 28000,
  print: 9000,
  full: 45000
};

estimateForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const type = qs('#estimateType')?.value;
  const urgency = qs('#estimateUrgency')?.value;
  const qty = Math.max(1, Number(qs('#estimateQty')?.value || 1));

  const base = basePrice[type] || 0;
  const urgencyFactor = urgency === 'urgent' ? 1.35 : 1;
  const min = Math.round(base * qty * urgencyFactor);
  const max = Math.round(min * 1.35);

  if (estimateResult) {
    estimateResult.textContent = `Ориентир: ${min.toLocaleString('ru-RU')} — ${max.toLocaleString('ru-RU')} ₽`;
  }
  showToast('Оценка готова. Можно отправить заявку.');
});

const leadForm = qs('#lead-form');
const formStatus = qs('#formStatus');

leadForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!leadForm.checkValidity()) {
    if (formStatus) formStatus.textContent = 'Проверьте обязательные поля формы.';
    showToast('Не все поля заполнены.');
    leadForm.reportValidity();
    return;
  }

  leadForm.reset();
  if (formStatus) formStatus.textContent = 'Спасибо! Заявка отправлена. Мы свяжемся с вами в рабочее время.';
  showToast('Заявка отправлена.');
});

qsa('#faq details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    qsa('#faq details').forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});
