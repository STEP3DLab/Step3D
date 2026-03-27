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
const topbar = qs('.topbar');
const topbarClose = qs('#topbarClose');
if (localStorage.getItem('topbarHidden') === '1') topbar?.classList.add('is-hidden');
topbarClose?.addEventListener('click', () => {
  topbar?.classList.add('is-hidden');
  localStorage.setItem('topbarHidden', '1');
});
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

  document.addEventListener('click', (event) => {
    if (!mainNav.classList.contains('open')) return;
    if (mainNav.contains(event.target) || menuToggle.contains(event.target)) return;
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!mainNav.classList.contains('open')) return;
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.focus();
  });
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') document.body.classList.add('dark');
themeToggle?.setAttribute('aria-pressed', String(document.body.classList.contains('dark')));
themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.setAttribute('aria-pressed', String(isDark));
});

a11yToggle?.addEventListener('click', () => {
  if (!a11yPanel) return;
  a11yPanel.hidden = !a11yPanel.hidden;
});

const storedScale = Number(localStorage.getItem('fontScale') || '1');
if (storedScale >= 0.95 && storedScale <= 1.3) document.body.style.setProperty('--font-scale', String(storedScale));
if (localStorage.getItem('reduceMotion') === '1') document.body.classList.add('reduce-motion');

qs('#fontInc')?.addEventListener('click', () => {
  const current = Number(getComputedStyle(document.body).getPropertyValue('--font-scale')) || 1;
  const next = Math.min(1.3, current + 0.05);
  document.body.style.setProperty('--font-scale', String(next));
  localStorage.setItem('fontScale', String(next));
});
qs('#fontDec')?.addEventListener('click', () => {
  const current = Number(getComputedStyle(document.body).getPropertyValue('--font-scale')) || 1;
  const next = Math.max(0.95, current - 0.05);
  document.body.style.setProperty('--font-scale', String(next));
  localStorage.setItem('fontScale', String(next));
});
qs('#motionToggle')?.addEventListener('click', () => {
  document.body.classList.toggle('reduce-motion');
  localStorage.setItem('reduceMotion', document.body.classList.contains('reduce-motion') ? '1' : '0');
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
const complexityValue = qs('#complexityValue');
const urgencyValue = qs('#urgencyValue');
const partsValue = qs('#partsValue');
const complexityHint = qs('#complexityHint');
const urgencyHint = qs('#urgencyHint');
const partsHint = qs('#partsHint');
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

  if (complexityValue) complexityValue.textContent = `${complexity} / 5`;
  if (urgencyValue) urgencyValue.textContent = `${urgency} / 5`;
  if (partsValue) partsValue.textContent = `${parts} шт.`;
  if (complexityHint) complexityHint.textContent = complexity >= 4 ? 'Высокая сложность: потребуется больше согласований.' : complexity <= 2 ? 'Низкая сложность: быстрый старт проекта.' : 'Средняя сложность.';
  if (urgencyHint) urgencyHint.textContent = urgency >= 4 ? 'Высокая срочность: фокус на ускоренном цикле.' : urgency <= 2 ? 'Стандартный график.' : 'Умеренная срочность.';
  if (partsHint) partsHint.textContent = parts > 30 ? 'Большой объём: добавим контрольные точки.' : 'Небольшая партия.';
};
qsa('input', estimatorForm || document).forEach((input) => input.addEventListener('input', updateEstimator));
updateEstimator();

qs('#estimatorReset')?.addEventListener('click', () => {
  const complexity = qs('#complexity');
  const urgency = qs('#urgency');
  const parts = qs('#parts');
  if (complexity) complexity.value = '3';
  if (urgency) urgency.value = '2';
  if (parts) parts.value = '10';
  updateEstimator();
  showToast('Параметры брифа сброшены.');
});

qs('#estimateCopy')?.addEventListener('click', async () => {
  if (!navigator.clipboard) return;
  const text = `Оценка STEP_3D: ${estimateBudget?.textContent || ''}, ${estimateTime?.textContent || ''}, риск: ${estimateRisk?.textContent || ''}`;
  await navigator.clipboard.writeText(text);
  showToast('Оценка скопирована.');
});

const taskField = qs('#task');
const taskCounter = qs('#taskCounter');
const formProgressBar = qs('#formProgressBar');
const formProgressText = qs('#formProgressText');

const updateTaskCounter = () => {
  if (!taskField || !taskCounter) return;
  const max = taskField.maxLength || 500;
  const length = taskField.value.length;
  taskCounter.textContent = `${length} / ${max}`;
  taskCounter.classList.toggle('near-limit', length >= max * 0.8 && length < max);
  taskCounter.classList.toggle('at-limit', length >= max);
};

taskField?.addEventListener('input', updateTaskCounter);
updateTaskCounter();

const leadForm = qs('#lead-form');
const formStatus = qs('#formStatus');
const submitButton = qs('#formSubmit');
const saveDraftButton = qs('#saveDraft');
const draftStatus = qs('#draftStatus');
const requiredFields = qsa('input[required], textarea[required], select[required]', leadForm || document);
const updateFormProgress = () => {
  if (!formProgressBar || !formProgressText || requiredFields.length === 0) return;
  const done = requiredFields.filter((field) => field.value.trim().length > 0).length;
  const percent = (done / requiredFields.length) * 100;
  formProgressBar.style.width = `${percent}%`;
  formProgressText.textContent = `Заполнено ${done} из ${requiredFields.length} обязательных полей`;
  if (submitButton) submitButton.disabled = done < requiredFields.length;
};

const validateField = (field) => {
  const value = field.value.trim();
  let valid = true;

  if (field.hasAttribute('required') && !value) valid = false;
  if (field.id === 'name' && value.length > 0 && value.length < 2) valid = false;
  if (field.id === 'contact' && value.length > 0 && value.length < 5) valid = false;

  field.classList.toggle('is-invalid', !valid);
  field.setAttribute('aria-invalid', String(!valid));
  const errorEl = qs(`#${field.id}Error`);
  if (errorEl) {
    if (valid) errorEl.textContent = '';
    else if (!value) errorEl.textContent = 'Поле обязательно для заполнения.';
    else if (field.id === 'name') errorEl.textContent = 'Введите минимум 2 символа.';
    else if (field.id === 'contact') errorEl.textContent = 'Укажите корректный контакт (минимум 5 символов).';
    else errorEl.textContent = 'Проверьте заполнение поля.';
  }
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

const draftKey = 'step3dLeadDraft';
const saveDraft = () => {
  if (!leadForm) return;
  const data = Object.fromEntries(new FormData(leadForm).entries());
  localStorage.setItem(draftKey, JSON.stringify(data));
  if (draftStatus) draftStatus.textContent = `Черновик сохранён: ${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
};

const restoreDraft = () => {
  if (!leadForm) return;
  const raw = localStorage.getItem(draftKey);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    requiredFields.forEach((field) => {
      const value = data[field.name];
      if (typeof value === 'string') field.value = value;
    });
    updateTaskCounter();
    updateFormProgress();
    if (draftStatus) draftStatus.textContent = 'Черновик восстановлен автоматически.';
  } catch {
    localStorage.removeItem(draftKey);
  }
};

restoreDraft();
saveDraftButton?.addEventListener('click', () => {
  saveDraft();
  showToast('Черновик сохранён локально.');
});
requiredFields.forEach((field) => field.addEventListener('change', saveDraft));

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
  localStorage.removeItem(draftKey);
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
  const details = qsa('#faq details');
  let visible = 0;
  details.forEach((detail) => {
    const text = detail.textContent?.toLowerCase() || '';
    const hidden = phrase.length > 0 && !text.includes(phrase);
    detail.classList.toggle('is-hidden', hidden);
    if (!hidden) visible += 1;
  });

  const meta = qs('#faqSearchMeta');
  if (meta) meta.textContent = `Найдено ${visible} из ${details.length} вопросов`;
  qs('#faqEmpty')?.toggleAttribute('hidden', visible > 0);
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
