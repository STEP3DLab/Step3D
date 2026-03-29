document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const root = document.documentElement;
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const progress = document.getElementById('scrollProgress');
  const themeToggle = document.getElementById('themeToggle');
  const navLinks = [...document.querySelectorAll('.nav a')];
  const sections = [...document.querySelectorAll('main section[id]')];

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

  const onScroll = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) {
      progress.style.width = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
    }

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

  document.querySelectorAll('.faq-item').forEach((item) => {
    const button = item.querySelector('.faq-btn');
    button?.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');
      document.querySelectorAll('.faq-item').forEach((other) => {
        other.classList.remove('is-open');
        other.querySelector('.faq-btn')?.setAttribute('aria-expanded', 'false');
      });

      if (willOpen) {
        item.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const caseGrid = document.getElementById('caseGrid');
  const caseModal = document.getElementById('caseModal');
  const caseModalContent = document.getElementById('caseModalContent');
  const caseModalClose = document.getElementById('caseModalClose');
  const cases = Array.isArray(window.STEP3D_CASES) ? window.STEP3D_CASES : [];
  const fallbackText = 'По запросу';
  const toText = (value) => (typeof value === 'string' && value.trim().length ? value.trim() : fallbackText);

  const renderCaseCard = (item) => {
    const card = document.createElement('article');
    card.className = 'case-card';
    card.innerHTML = `
      <div class="case-top">
        <p class="case-type">${toText(item.categoryLabel)}</p>
        <p class="case-meta">${toText(item.timeline)}</p>
      </div>
      <h3>${toText(item.title)}</h3>
      <p>${toText(item.problem)}</p>
      <button class="case-link" data-case-id="${item.id}" type="button">Открыть кейс →</button>
    `;
    return card;
  };

  const renderCases = (filter = 'all') => {
    if (!caseGrid) return;
    caseGrid.innerHTML = '';
    const filtered = filter === 'all' ? cases : cases.filter((item) => Array.isArray(item.type) && item.type.includes(filter));

    if (!filtered.length) {
      caseGrid.innerHTML = '<article class="card"><h3>Нет кейсов в этой категории</h3><p>Выберите другой фильтр или отправьте задачу — подберем релевантные примеры.</p></article>';
      return;
    }

    filtered.forEach((item) => caseGrid.appendChild(renderCaseCard(item)));
  };

  const openCaseModal = (caseId) => {
    const selected = cases.find((item) => item.id === caseId);
    if (!selected || !caseModal || !caseModalContent) return;

    const timeline = toText(selected.timeline);
    const budget = toText(selected.budget);

    caseModalContent.innerHTML = `
      <h3>${toText(selected.title)}</h3>
      <p>${toText(selected.problem)}</p>
      <div class="modal-grid">
        <div><strong>Тип задачи</strong><p>${toText(selected.taskType)}</p></div>
        <div><strong>Что сделали</strong><p>${toText(selected.solution)}</p></div>
        <div><strong>Результат</strong><p>${toText(selected.result)}</p></div>
        <div><strong>Срок / бюджет</strong><p>${timeline} · ${budget}</p></div>
      </div>
    `;

    caseModal.showModal();
    body.classList.add('modal-open');
  };

  document.querySelectorAll('.filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter || 'all';
      document.querySelectorAll('.filter-btn').forEach((item) => {
        item.classList.remove('is-active');
        item.setAttribute('aria-selected', 'false');
      });
      button.classList.add('is-active');
      button.setAttribute('aria-selected', 'true');
      renderCases(filter);
    });
  });

  caseGrid?.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.matches('.case-link')) {
      openCaseModal(target.dataset.caseId || '');
    }
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

  const contactForm = document.getElementById('contactForm');
  const contactFormStatus = document.getElementById('contactFormStatus');
  const submitButton = contactForm?.querySelector('button[type="submit"]');

  const normalizeSpaces = (value) => value.replace(/\s+/g, ' ').trim();
  const normalizeTask = (value) => value.replace(/\r\n/g, '\n').split('\n').map((line) => line.trim()).filter(Boolean).join('\n');
  const validateRequired = (value, minLength = 2) => value.length >= minLength;

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

    if (!validateRequired(name)) return setSubmitState('error', 'Укажите имя и фамилию (минимум 2 символа).');
    if (!validateRequired(contact, 3)) return setSubmitState('error', 'Укажите корректный контакт для связи.');
    if (!type) return setSubmitState('error', 'Выберите тип проекта.');
    if (!validateRequired(task, 10)) return setSubmitState('error', 'Добавьте более подробное описание задачи (минимум 10 символов).');
    if (!consent) return setSubmitState('error', 'Подтвердите согласие на обработку данных.');

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
