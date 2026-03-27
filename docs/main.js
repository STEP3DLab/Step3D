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
const themeToggle = qs('#themeToggle');
const a11yToggle = qs('#a11yToggle');
const a11yPanel = qs('#a11yPanel');
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

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') document.body.classList.add('dark');
themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

a11yToggle?.addEventListener('click', () => {
  if (!a11yPanel) return;
  a11yPanel.hidden = !a11yPanel.hidden;
});

qs('#fontInc')?.addEventListener('click', () => {
  const current = Number(getComputedStyle(document.body).getPropertyValue('--font-scale')) || 1;
  document.body.style.setProperty('--font-scale', String(Math.min(1.25, current + 0.05)));
});
qs('#fontDec')?.addEventListener('click', () => {
  const current = Number(getComputedStyle(document.body).getPropertyValue('--font-scale')) || 1;
  document.body.style.setProperty('--font-scale', String(Math.max(0.9, current - 0.05)));
});
qs('#motionToggle')?.addEventListener('click', () => {
  document.body.classList.toggle('reduce-motion');
});

const progressBar = qs('#scrollProgressBar');
const sections = qsa('main section[id]');
const navLinks = qsa('.main-nav a[href^="#"]');
const quickLinks = qsa('[data-quick-link]');
const siteHeader = qs('.site-header');
const backToTop = qs('#backToTop');

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
  quickLinks.forEach((link) => {
    const href = link.getAttribute('href')?.replace('#', '');
    link.classList.toggle('active', href === activeId);
  });

  siteHeader?.classList.toggle('is-scrolled', window.scrollY > 16);
  backToTop?.classList.toggle('show', window.scrollY > 520);
};

window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

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

qsa('.case-more').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.case-card');
    const extra = qs('.case-extra', card || document);
    if (!extra) return;
    const expanded = !extra.hasAttribute('hidden');
    if (expanded) {
      extra.setAttribute('hidden', '');
      button.textContent = 'Показать результат';
    } else {
      extra.removeAttribute('hidden');
      button.textContent = 'Скрыть';
    }
  });
});

const estimatorForm = qs('#estimatorForm');
const estimateBudget = qs('#estimateBudget');
const estimateTime = qs('#estimateTime');
const estimateRisk = qs('#estimateRisk');
const updateEstimator = () => {
  if (!estimatorForm || !estimateBudget || !estimateTime || !estimateRisk) return;
  const complexity = Number(qs('#complexity')?.value || 3);
  const urgency = Number(qs('#urgency')?.value || 2);
  const parts = Number(qs('#parts')?.value || 10);
  const budget = 40000 + complexity * 22000 + urgency * 15000 + parts * 2800;
  const days = Math.max(3, Math.round((complexity * 4 + parts * 0.45) - urgency * 1.5));
  const riskLevel = complexity >= 4 || urgency >= 4 ? 'Повышенный' : parts > 30 ? 'Средний+' : 'Средний';
  estimateBudget.textContent = `~ ${budget.toLocaleString('ru-RU')} ₽`;
  estimateTime.textContent = `${days} рабочих дней`;
  estimateRisk.textContent = riskLevel;
};
qsa('input', estimatorForm || document).forEach((input) => input.addEventListener('input', updateEstimator));
updateEstimator();

const taskField = qs('#task');
const taskCounter = qs('#taskCounter');
const formProgressBar = qs('#formProgressBar');
const formProgressText = qs('#formProgressText');

const updateTaskCounter = () => {
  if (!taskField || !taskCounter) return;
  taskCounter.textContent = `${taskField.value.length} / ${taskField.maxLength || 500}`;
};

taskField?.addEventListener('input', updateTaskCounter);
updateTaskCounter();

const leadForm = qs('#lead-form');
const formStatus = qs('#formStatus');
const submitButton = qs('#formSubmit');
const requiredFields = qsa('input[required], textarea[required], select[required]', leadForm || document);
const updateFormProgress = () => {
  if (!formProgressBar || !formProgressText || requiredFields.length === 0) return;
  const done = requiredFields.filter((field) => field.value.trim().length > 0).length;
  const percent = (done / requiredFields.length) * 100;
  formProgressBar.style.width = `${percent}%`;
  formProgressText.textContent = `Заполнено ${done} из ${requiredFields.length} обязательных полей`;
};

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
    updateFormProgress();
  });
});
updateFormProgress();

leadForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const isValid = requiredFields.every((field) => validateField(field));
  if (!isValid) {
    formStatus.textContent = 'Проверьте форму: обязательные поля заполнены не полностью или с ошибками.';
    formStatus.className = 'error';
    showToast('Исправьте поля формы.');
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = 'Отправляем...';
  formStatus.textContent = 'Передаём данные инженеру...';
  formStatus.className = '';

  await new Promise((resolve) => setTimeout(resolve, 850));

  leadForm.reset();
  requiredFields.forEach((field) => field.classList.remove('is-invalid'));
  updateTaskCounter();

  formStatus.textContent = 'Заявка принята. Ответ инженера поступит в рабочее время.';
  formStatus.className = 'success';
  submitButton.disabled = false;
  submitButton.textContent = 'Отправить инженеру';
  showToast('Заявка принята.');
  updateFormProgress();
  qs('#successModal')?.showModal();
});

qsa('#faq details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    qsa('#faq details').forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});

qs('#faqSearch')?.addEventListener('input', (event) => {
  const phrase = String(event.target.value || '').toLowerCase().trim();
  qsa('#faq details').forEach((detail) => {
    const text = detail.textContent?.toLowerCase() || '';
    detail.classList.toggle('is-hidden', phrase.length > 0 && !text.includes(phrase));
  });
});

qsa('.copy-chip').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const value = btn.getAttribute('data-copy');
    if (!value || !navigator.clipboard) return;
    await navigator.clipboard.writeText(value);
    showToast('Контакт скопирован.');
  });
});

qs('#closeModal')?.addEventListener('click', () => {
  qs('#successModal')?.close();
});
