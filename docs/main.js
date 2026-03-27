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
    if (window.scrollY >= section.offsetTop - 180) activeId = section.id;
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
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

  revealItems.forEach((item, idx) => {
    item.style.transitionDelay = `${Math.min(0.32, idx * 0.035)}s`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add('in-view'));
}

const chips = qsa('.chip');
const caseCards = qsa('#caseGrid .case-card');

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    const filter = chip.dataset.filter || 'all';

    chips.forEach((item) => {
      item.classList.remove('active');
      item.setAttribute('aria-pressed', 'false');
    });
    chip.classList.add('active');
    chip.setAttribute('aria-pressed', 'true');

    caseCards.forEach((card) => {
      const categories = (card.dataset.category || '').split(' ');
      const show = filter === 'all' || categories.includes(filter);
      card.classList.toggle('is-hidden', !show);
    });
  });
});

const leadForm = qs('#lead-form');
const formStatus = qs('#formStatus');
const submitButton = qs('#formSubmit');
const requiredFields = qsa('input[required], textarea[required], select[required]', leadForm || document);

const validateField = (field) => {
  const value = field.value.trim();
  let valid = true;

  if (field.hasAttribute('required') && !value) valid = false;
  if (field.id === 'name' && value.length > 0 && value.length < 2) valid = false;

  field.classList.toggle('is-invalid', !valid);
  return valid;
};

requiredFields.forEach((field) => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    if (field.classList.contains('is-invalid')) validateField(field);
  });
});

leadForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const isValid = requiredFields.every((field) => validateField(field));
  if (!isValid) {
    formStatus.textContent = 'Проверьте обязательные поля: есть незаполненные или некорректные значения.';
    formStatus.className = 'error';
    showToast('Нужно заполнить форму корректно.');
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = 'Отправка...';
  formStatus.textContent = 'Отправляем данные...';
  formStatus.className = '';

  await new Promise((resolve) => setTimeout(resolve, 850));

  leadForm.reset();
  requiredFields.forEach((field) => field.classList.remove('is-invalid'));

  formStatus.textContent = 'Спасибо! Заявка отправлена. Мы свяжемся с вами в рабочее время.';
  formStatus.className = 'success';
  submitButton.disabled = false;
  submitButton.textContent = 'Отправить заявку';
  showToast('Заявка успешно отправлена.');
});

qsa('#faq details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    qsa('#faq details').forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});
