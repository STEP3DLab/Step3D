document.addEventListener('DOMContentLoaded', async () => {
  const body = document.body;
  const root = document.documentElement;
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const progress = document.getElementById('scrollProgress');
  const themeToggle = document.getElementById('themeToggle');
  const localeToggle = document.getElementById('localeToggle');
  const navLinks = [...document.querySelectorAll('.nav a')];
  const sections = [...document.querySelectorAll('main section[id]')];

  const formatLayer = window.STEP3D_FORMAT;
  const locale = formatLayer?.detectLocale?.() || 'ru';
  formatLayer?.setLocale?.(locale);

  const FALLBACK_CASES = [];

  const isLocalizedValue = (value) => typeof value === 'string' || (value && typeof value === 'object');
  const isValidCase = (item) => {
    if (!item || typeof item !== 'object') return false;
    if (typeof item.id !== 'string' || !item.id.trim()) return false;
    if (!Array.isArray(item.type) || !item.type.length || !item.type.every((entry) => typeof entry === 'string' && entry.trim())) return false;
    return ['title', 'problem', 'solution', 'result'].every((key) => isLocalizedValue(item[key]));
  };

  const loadCases = async () => {
    try {
      const response = await fetch('assets/data/cases.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      const items = Array.isArray(payload?.items) ? payload.items.filter(isValidCase) : [];
      if (items.length) return items;
      throw new Error('Schema validation failed for cases.json');
    } catch (error) {
      console.warn('[Step3D] Using fallback cases data:', error);
      return FALLBACK_CASES.filter(isValidCase);
    }
  };

  const cases = await loadCases();

  const applyLocale = (nextLocale) => {
    const normalized = formatLayer?.setLocale?.(nextLocale) || nextLocale;
    if (localeToggle) localeToggle.textContent = normalized === 'ru' ? 'EN' : 'RU';
  };
  applyLocale(locale);

  localeToggle?.addEventListener('click', () => {
    const currentLocale = formatLayer?.detectLocale?.() || locale;
    const nextLocale = currentLocale === 'ru' ? 'en' : 'ru';
    applyLocale(nextLocale);
    window.location.reload();
  });

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('step3d-theme', theme);
    if (themeToggle) {
      const isLight = theme === 'light';
      themeToggle.textContent = isLight ? 'Тёмная тема' : 'Светлая тема';
      themeToggle.setAttribute('aria-pressed', String(isLight));
    }
  };

  const savedTheme = localStorage.getItem('step3d-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    applyTheme(savedTheme);
  } else {
    applyTheme('dark');
  }

  themeToggle?.addEventListener('click', () => {
    const nextTheme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
  });

  const closeMobileNav = () => {
    nav?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
  };

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      body.classList.toggle('menu-open', isOpen);
    });

    navLinks.forEach((link) => link.addEventListener('click', closeMobileNav));

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (!nav.classList.contains('is-open')) return;
      if (target.closest('#nav') || target.closest('#menuToggle')) return;
      closeMobileNav();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMobileNav();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        closeMobileNav();
      }
    });
  }

  const toTopBtn = document.getElementById('toTopBtn');

  const onScroll = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) {
      progress.style.width = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
    }
    toTopBtn?.classList.toggle('is-visible', window.scrollY > 560);

    let activeId = '';
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= 140) {
        activeId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isCurrent = link.getAttribute('href') === `#${activeId}`;
      link.classList.toggle('is-active', isCurrent);
      link.setAttribute('aria-current', isCurrent ? 'page' : 'false');
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const faqItems = [...document.querySelectorAll('.faq-item')];
  const faqExpandAll = document.getElementById('faqExpandAll');
  const faqCollapseAll = document.getElementById('faqCollapseAll');

  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-btn');
    button?.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');
      item.classList.toggle('is-open', willOpen);
      button.setAttribute('aria-expanded', String(willOpen));
    });
  });

  faqExpandAll?.addEventListener('click', () => {
    faqItems.forEach((item) => {
      item.classList.add('is-open');
      item.querySelector('.faq-btn')?.setAttribute('aria-expanded', 'true');
    });
  });

  faqCollapseAll?.addEventListener('click', () => {
    faqItems.forEach((item) => {
      item.classList.remove('is-open');
      item.querySelector('.faq-btn')?.setAttribute('aria-expanded', 'false');
    });
  });

  const localize = (value) => formatLayer?.localize?.(value, locale, '') || '';
  const textOrFallback = (value) => formatLayer?.textOrFallback?.(value, locale) || 'По запросу';

  const caseGrid = document.getElementById('caseGrid');
  const caseModal = document.getElementById('caseModal');
  const caseModalContent = document.getElementById('caseModalContent');
  const caseModalClose = document.getElementById('caseModalClose');

  const renderCaseCard = (item) => {
    const card = document.createElement('article');
    card.className = 'case-card';

    const top = document.createElement('div');
    top.className = 'case-top';

    const type = document.createElement('p');
    type.className = 'case-type';
    type.textContent = textOrFallback(item.categoryLabel);

    const meta = document.createElement('p');
    meta.className = 'case-meta';
    meta.textContent = textOrFallback(item.timeline);

    top.append(type, meta);

    const title = document.createElement('h3');
    title.textContent = textOrFallback(item.title);

    const problem = document.createElement('p');
    problem.textContent = textOrFallback(item.problem);

    const openButton = document.createElement('button');
    openButton.className = 'case-link';
    openButton.type = 'button';
    openButton.dataset.caseId = item.id;
    openButton.textContent = formatLayer?.getLabel?.(locale, 'openCase') || 'Открыть кейс →';

    card.append(top, title, problem, openButton);
    return card;
  };

  const caseSearch = document.getElementById('caseSearch');
  const casesCount = document.getElementById('casesCount');

  const renderCases = (filter = 'all', query = '') => {
    if (!caseGrid) return;
    caseGrid.textContent = '';
    const filteredByType = filter === 'all' ? cases : cases.filter((item) => Array.isArray(item.type) && item.type.includes(filter));
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = normalizedQuery
      ? filteredByType.filter((item) => [item.title, item.problem, item.solution, item.result, item.taskType, item.categoryLabel].map(localize).join(' ').toLowerCase().includes(normalizedQuery))
      : filteredByType;

    if (casesCount) {
      casesCount.textContent = formatLayer?.getLabel?.(locale, 'casesFound', filtered.length) || `Найдено кейсов: ${filtered.length}`;
    }

    if (!filtered.length) {
      const emptyCard = document.createElement('article');
      emptyCard.className = 'card';
      const h3 = document.createElement('h3');
      h3.textContent = formatLayer?.getLabel?.(locale, 'noCasesTitle') || 'Нет кейсов в этой категории';
      const p = document.createElement('p');
      p.textContent = formatLayer?.getLabel?.(locale, 'noCasesBody') || 'Выберите другой фильтр или отправьте задачу — подберем релевантные примеры.';
      emptyCard.append(h3, p);
      caseGrid.appendChild(emptyCard);
      return;
    }

    filtered.forEach((item) => caseGrid.appendChild(renderCaseCard(item)));
  };

  const openCaseModal = (caseId) => {
    const selected = cases.find((item) => item.id === caseId);
    if (!selected || !caseModal || !caseModalContent) return;

    caseModalContent.textContent = '';

    const heading = document.createElement('h3');
    heading.textContent = textOrFallback(selected.title);

    const problem = document.createElement('p');
    problem.textContent = textOrFallback(selected.problem);

    const grid = document.createElement('div');
    grid.className = 'modal-grid';

    const modalRows = [
      [formatLayer?.getLabel?.(locale, 'modalTaskType') || 'Тип задачи', selected.taskType],
      [formatLayer?.getLabel?.(locale, 'modalSolution') || 'Что сделали', selected.solution],
      [formatLayer?.getLabel?.(locale, 'modalResult') || 'Результат', selected.result],
      [
        formatLayer?.getLabel?.(locale, 'modalTimelineBudget') || 'Срок / бюджет',
        formatLayer?.formatTimelineBudget?.(selected.timeline, selected.budget, locale) || `${textOrFallback(selected.timeline)} · ${textOrFallback(selected.budget)}`,
      ],
    ];

    modalRows.forEach(([label, value]) => {
      const wrapper = document.createElement('div');
      const strong = document.createElement('strong');
      strong.textContent = String(label);
      const text = document.createElement('p');
      text.textContent = typeof value === 'string' ? value : textOrFallback(value);
      wrapper.append(strong, text);
      grid.appendChild(wrapper);
    });

    caseModalContent.append(heading, problem, grid);

    caseModal.showModal();
    body.classList.add('modal-open');
  };

  let activeCaseFilter = 'all';

  document.querySelectorAll('.filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter || 'all';
      activeCaseFilter = filter;
      document.querySelectorAll('.filter-btn').forEach((item) => {
        item.classList.remove('is-active');
        item.setAttribute('aria-selected', 'false');
      });
      button.classList.add('is-active');
      button.setAttribute('aria-selected', 'true');
      renderCases(filter, caseSearch instanceof HTMLInputElement ? caseSearch.value : '');
    });
  });

  caseGrid?.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.matches('.case-link')) {
      openCaseModal(target.dataset.caseId || '');
    }
  });

  caseSearch?.addEventListener('input', () => {
    renderCases(activeCaseFilter, caseSearch instanceof HTMLInputElement ? caseSearch.value : '');
  });

  const closeCaseModal = () => {
    caseModal?.close();
    body.classList.remove('modal-open');
  };

  caseModalClose?.addEventListener('click', closeCaseModal);
  caseModal?.addEventListener('click', (event) => {
    if (event.target === caseModal) closeCaseModal();
  });

  renderCases();

  toTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const contactForm = document.getElementById('contactForm');
  const contactFormStatus = document.getElementById('contactFormStatus');
  const submitButton = contactForm?.querySelector('button[type="submit"]');
  const taskField = document.getElementById('taskField');
  const taskCounter = document.getElementById('taskCounter');
  const fileInput = document.getElementById('fileInput');
  const fileSummary = document.getElementById('fileSummary');
  const formProgressBar = document.getElementById('formProgressBar');
  const formProgressText = document.getElementById('formProgressText');

  const normalizeSpaces = (value) => value.replace(/\s+/g, ' ').trim();
  const normalizeTask = (value) => value.replace(/\r\n/g, '\n').split('\n').map((line) => line.trim()).filter(Boolean).join('\n');
  const validateRequired = (value, minLength = 2) => value.length >= minLength;


  const updateTaskCounter = () => {
    if (!(taskField instanceof HTMLTextAreaElement) || !taskCounter) return;
    taskCounter.textContent = `${taskField.value.length} / ${taskField.maxLength || 1200}`;
  };

  const updateFileSummary = () => {
    if (!(fileInput instanceof HTMLInputElement) || !fileSummary) return;
    const total = fileInput.files?.length || 0;
    fileSummary.textContent = total ? `Выбрано файлов: ${total}` : 'Файлы не выбраны';
  };

  const setFieldValidityState = (field, valid) => {
    if (!(field instanceof HTMLElement)) return;
    field.classList.toggle('is-invalid', !valid);
    field.setAttribute('aria-invalid', String(!valid));
  };

  const updateFormProgress = () => {
    if (!contactForm || !formProgressBar || !formProgressText) return;
    const requiredFields = [...contactForm.querySelectorAll('[required]')];
    const completed = requiredFields.filter((field) => {
      if (field instanceof HTMLInputElement && field.type === 'checkbox') return field.checked;
      return String(field.value || '').trim().length > 0;
    }).length;
    const percent = requiredFields.length ? Math.round((completed / requiredFields.length) * 100) : 0;
    formProgressBar.style.width = `${percent}%`;
    formProgressText.textContent = `Заполнено ${percent}% обязательных полей`;
  };

  taskField?.addEventListener('input', updateTaskCounter);
  fileInput?.addEventListener('change', updateFileSummary);

  contactForm?.addEventListener('input', updateFormProgress);
  contactForm?.addEventListener('change', updateFormProgress);

  updateTaskCounter();
  updateFileSummary();
  updateFormProgress();

  const setSubmitState = (state, message) => {
    if (!contactFormStatus) return;
    contactFormStatus.hidden = false;
    contactFormStatus.textContent = message;
    contactFormStatus.classList.remove('is-loading', 'is-success', 'is-error');
    contactFormStatus.classList.add(`is-${state}`);
  };

  contactForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);

    const name = normalizeSpaces(String(formData.get('name') || ''));
    const company = normalizeSpaces(String(formData.get('company') || ''));
    const contact = normalizeSpaces(String(formData.get('contact') || ''));
    const type = normalizeSpaces(String(formData.get('type') || ''));
    const task = normalizeTask(String(formData.get('task') || ''));
    const consent = formData.get('consent');

    const nameField = contactForm?.elements.namedItem('name');
    const contactField = contactForm?.elements.namedItem('contact');
    const typeField = contactForm?.elements.namedItem('type');
    const taskTextField = contactForm?.elements.namedItem('task');
    const consentField = contactForm?.elements.namedItem('consent');

    const isNameValid = validateRequired(name);
    const isContactValid = validateRequired(contact, 3);
    const isTypeValid = Boolean(type);
    const isTaskValid = validateRequired(task, 10);
    const isConsentValid = Boolean(consent);

    setFieldValidityState(nameField, isNameValid);
    setFieldValidityState(contactField, isContactValid);
    setFieldValidityState(typeField, isTypeValid);
    setFieldValidityState(taskTextField, isTaskValid);
    setFieldValidityState(consentField, isConsentValid);

    if (!isNameValid) return setSubmitState('error', 'Укажите имя и фамилию (минимум 2 символа).');
    if (!isContactValid) return setSubmitState('error', 'Укажите корректный контакт для связи.');
    if (!isTypeValid) return setSubmitState('error', 'Выберите тип проекта.');
    if (!isTaskValid) return setSubmitState('error', 'Добавьте более подробное описание задачи (минимум 10 символов).');
    if (!isConsentValid) return setSubmitState('error', 'Подтвердите согласие на обработку данных.');

    const message = [
      'Новая заявка с сайта Step3D',
      `Имя: ${name}`,
      `Компания/роль: ${company || '—'}`,
      `Контакт: ${contact}`,
      `Тип задачи: ${type}`,
      `Описание: ${task}`,
    ].join('\n');

    setSubmitState('loading', 'Проверяем заявку и подготавливаем отправку…');
    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
      submitButton.setAttribute('aria-busy', 'true');
    }

    try {
      await navigator.clipboard.writeText(message);
      window.location.href = `mailto:hello@step3d.pro?subject=${encodeURIComponent('Новая заявка Step3D')}&body=${encodeURIComponent(message)}`;
      setSubmitState('success', 'Заявка подготовлена. Проверьте письмо и отправьте его — после этого мы свяжемся с вами.');
      contactForm.reset();
    } catch {
      setSubmitState('error', 'Не удалось сформировать отправку автоматически. Напишите нам на hello@step3d.pro.');
    } finally {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-busy');
      }
    }
  });
});
