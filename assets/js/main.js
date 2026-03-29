document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const root = document.documentElement;
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const progress = document.getElementById('scrollProgress');
  const themeToggle = document.getElementById('themeToggle');
  const navLinks = [...document.querySelectorAll('.nav a')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const getFocusableElements = (container) => {
    if (!(container instanceof HTMLElement)) return [];
    return [...container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter((node) => node instanceof HTMLElement && !node.hasAttribute('hidden') && node.getAttribute('aria-hidden') !== 'true');
  };

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const getLowPowerMode = () => {
    const memory = navigator.deviceMemory || 0;
    const cpu = navigator.hardwareConcurrency || 0;
    return motionQuery.matches || (memory > 0 && memory <= 4) || (cpu > 0 && cpu <= 4);
  };
  const applyPerformanceMode = () => {
    body.classList.toggle('is-low-motion', getLowPowerMode());
  };

  applyPerformanceMode();
  motionQuery.addEventListener?.('change', applyPerformanceMode);

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

  const closeMobileNav = ({ restoreFocus = true } = {}) => {
    nav?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
    if (restoreFocus && menuToggle instanceof HTMLButtonElement) {
      menuToggle.focus();
    }
  };

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      body.classList.toggle('menu-open', isOpen);
      if (isOpen) {
        const firstFocusable = getFocusableElements(nav)[0];
        if (firstFocusable) {
          firstFocusable.focus();
        }
      } else {
        closeMobileNav({ restoreFocus: true });
      }
    });

    navLinks.forEach((link) => link.addEventListener('click', () => closeMobileNav({ restoreFocus: false })));

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (!nav.classList.contains('is-open')) return;
      if (target.closest('#nav') || target.closest('#menuToggle')) return;
      closeMobileNav({ restoreFocus: false });
    });

    document.addEventListener('keydown', (event) => {
      if (!nav.classList.contains('is-open')) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMobileNav({ restoreFocus: true });
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [menuToggle, ...getFocusableElements(nav)].filter((element) => element instanceof HTMLElement);
      if (!focusable.length) return;
      const currentIndex = focusable.indexOf(document.activeElement);
      const nextIndex = event.shiftKey
        ? (currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1)
        : (currentIndex === focusable.length - 1 ? 0 : currentIndex + 1);
      event.preventDefault();
      focusable[nextIndex]?.focus();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        closeMobileNav({ restoreFocus: false });
      }
    });
  }

  const toTopBtn = document.getElementById('toTopBtn');

  let activeId = sections[0]?.id || '';

  const setActiveNavLink = (id) => {
    navLinks.forEach((link) => {
      const isCurrent = !!id && link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', isCurrent);
      link.setAttribute('aria-current', isCurrent ? 'page' : 'false');
    });
  };

  const updateScrollProgress = () => {
    if (!progress) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
  };

  const onScrollShared = () => {
    updateScrollProgress();
    toTopBtn?.classList.toggle('is-visible', window.scrollY > 560);
  };

  let scrollTicking = false;
  const onScroll = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(() => {
      onScrollShared();
      scrollTicking = false;
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    const sectionPositions = new Map(sections.map((section, index) => [section.id, index]));
    const intersectionState = new Map();

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (!id) return;
          if (entry.isIntersecting) {
            intersectionState.set(id, entry.intersectionRatio);
          } else {
            intersectionState.delete(id);
          }
        });

        const nextId = [...intersectionState.entries()]
          .sort((a, b) => {
            if (b[1] !== a[1]) return b[1] - a[1];
            return (sectionPositions.get(a[0]) ?? 0) - (sectionPositions.get(b[0]) ?? 0);
          })[0]?.[0];

        if (nextId && nextId !== activeId) {
          activeId = nextId;
          setActiveNavLink(activeId);
        }
      },
      {
        rootMargin: '-35% 0px -45% 0px',
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    );

    sections.forEach((section) => sectionObserver.observe(section));
  } else {
    const updateActiveFromScroll = () => {
      let nextActiveId = '';
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= 140) {
          nextActiveId = section.id;
        }
      });
      if (nextActiveId !== activeId) {
        activeId = nextActiveId;
        setActiveNavLink(activeId);
      }
    };

    window.addEventListener(
      'scroll',
      () => {
        onScroll();
        updateActiveFromScroll();
      },
      { passive: true },
    );

    updateActiveFromScroll();
  }

  if ('IntersectionObserver' in window && sections.length) {
    window.addEventListener('scroll', onScroll, { passive: true });
    setActiveNavLink(activeId);
  }

  onScrollShared();

  const faqItems = [...document.querySelectorAll('.faq-item')];
  const faqExpandAll = document.getElementById('faqExpandAll');
  const faqCollapseAll = document.getElementById('faqCollapseAll');
  const faqButtons = faqItems.map((item) => item.querySelector('.faq-btn')).filter((button) => button instanceof HTMLButtonElement);

  const setFaqItemState = (item, isOpen) => {
    const button = item.querySelector('.faq-btn');
    const panelId = button?.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    item.classList.toggle('is-open', isOpen);
    button?.setAttribute('aria-expanded', String(isOpen));
    if (panel instanceof HTMLElement) {
      panel.hidden = !isOpen;
      panel.setAttribute('aria-hidden', String(!isOpen));
    }
  };

  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-btn');
    if (!(button instanceof HTMLButtonElement)) return;
    const isOpen = item.classList.contains('is-open');
    setFaqItemState(item, isOpen);
    button.addEventListener('click', () => {
      setFaqItemState(item, !item.classList.contains('is-open'));
    });
    button.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        button.click();
        return;
      }
      if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
      event.preventDefault();
      const currentIndex = faqButtons.indexOf(button);
      if (currentIndex === -1) return;
      const nextIndex = event.key === 'ArrowDown'
        ? (currentIndex + 1) % faqButtons.length
        : (currentIndex - 1 + faqButtons.length) % faqButtons.length;
      faqButtons[nextIndex]?.focus();
    });
  });

  faqExpandAll?.addEventListener('click', () => {
    faqItems.forEach((item) => {
      setFaqItemState(item, true);
    });
  });

  faqCollapseAll?.addEventListener('click', () => {
    faqItems.forEach((item) => {
      setFaqItemState(item, false);
    });
  });

  const caseGrid = document.getElementById('caseGrid');
  const caseModal = document.getElementById('caseModal');
  const caseModalContent = document.getElementById('caseModalContent');
  const caseModalClose = document.getElementById('caseModalClose');
  const caseDetail = document.getElementById('caseDetail');
  const casesPanel = document.getElementById('cases-panel');
  const cases = Array.isArray(window.STEP3D_CASES) ? window.STEP3D_CASES : [];
  const fallbackText = 'По запросу';
  const toText = (value) => (typeof value === 'string' && value.trim().length ? value.trim() : fallbackText);
  const scenarioConfig = {
    production: {
      title: 'Производство',
      cta: 'Запросить анти-простой маршрут',
      projectType: 'Реверсивный инжиниринг',
      taskHint: 'Укажите узел, текущий простой, критичные допуски и когда нужно вернуть линию в работу.',
      statusLoading: 'Формируем anti-downtime пакет: SLA, этапы и контрольные точки…',
      statusSuccess: 'Маршрут по производственному сценарию подготовлен. Проверьте письмо и отправьте его.',
      evidence: {
        metric: 'Снижение простоя до 41%',
        sla: 'SLA: ответ ≤24ч, старт 24–48ч',
        output: 'Пакет: STEP + STL + отчет отклонений + чек-лист запуска',
      },
    },
    medtech: {
      title: 'Медтех',
      cta: 'Получить маршрут валидации прототипа',
      projectType: 'Прототипирование',
      taskHint: 'Опишите версию изделия, требования к сборке, ограничения материалов и дату пилота.',
      statusLoading: 'Собираем медтех-план: итерации, валидация и пакет для пилота…',
      statusSuccess: 'План медтех-валидации подготовлен. Проверьте письмо и отправьте его.',
      evidence: {
        metric: '−52% поздних изменений в корпусе',
        sla: 'SLA: обновления статуса каждые 2 дня',
        output: 'Пакет: ревизии STL/STEP + протокол отклонений + рекомендации',
      },
    },
    rnd: {
      title: 'R&D',
      cta: 'Зафиксировать гипотезу и go/no-go',
      projectType: 'Комплексный инженерный проект',
      taskHint: 'Опишите гипотезу, критерии успеха эксперимента и формат артефакта для проверки.',
      statusLoading: 'Формируем R&D-спринт: гипотеза, артефакт, метрики и решение go/no-go…',
      statusSuccess: 'R&D-пакет подготовлен. Проверьте письмо и отправьте его.',
      evidence: {
        metric: 'До 3 инженерных итераций за 1 спринт',
        sla: 'SLA: старт пилота за 48ч после брифа',
        output: 'Пакет: CAD/STL + протокол теста + рекомендации следующего шага',
      },
    },
    architecture: {
      title: 'Архитектура',
      cta: 'Получить тендерный производственный план',
      projectType: '3D-печать / малая серия',
      taskHint: 'Укажите дату защиты, число модулей, требования к повторяемости и визуальной чистоте.',
      statusLoading: 'Собираем серию под дедлайн: производство, резерв и контроль качества…',
      statusSuccess: 'Сценарий архитектурной серии подготовлен. Проверьте письмо и отправьте его.',
      evidence: {
        metric: '120 модулей в срок без критичного брака',
        sla: 'SLA: контрольные апдейты по каждой партии',
        output: 'Пакет: серия деталей + резервные STL + инструкция сборки',
      },
    },
  };
  const baseTitle = document.title;
  const canonicalLink = document.querySelector('link[rel="canonical"]');

  const urgencyMap = { critical: 'Критично', high: 'Высокий', medium: 'Стандарт', low: 'Планово' };
  const resultTypeMap = { file: 'Файл', detail: 'Деталь', series: 'Серия' };

  const renderCaseCard = (item) => {
    const card = document.createElement('article');
    card.className = 'case-card';
    const scenario = scenarioConfig[item.scenario];
    const tags = Array.isArray(item.industryTags) ? item.industryTags.slice(0, 3) : [];
    card.innerHTML = `
      <div class="case-top">
        <p class="case-type">${toText(item.categoryLabel)}</p>
        <p class="case-meta">${toText(item.timeline)}</p>
      </div>
      <h3>${toText(item.title)}</h3>
      <p>${toText(item.problem)}</p>
      <div class="case-badges">
        <span class="case-badge">Сценарий: ${toText(scenario?.title)}</span>
        <span class="case-badge">Срочность: ${urgencyMap[item.urgencyLevel] || '—'}</span>
        <span class="case-badge">Результат: ${resultTypeMap[item.resultType] || '—'}</span>
      </div>
      ${tags.length ? `<p class="case-tags">${tags.map((tag) => `<span>#${tag}</span>`).join('')}</p>` : ''}
      <a class="case-link" data-case-id="${item.id}" href="?case=${encodeURIComponent(item.id)}#cases">Открыть кейс →</a>
    `;
    return card;
  };

  const caseSearch = document.getElementById('caseSearch');
  const casesCount = document.getElementById('casesCount');
  const filterButtons = [...document.querySelectorAll('.filter-btn')];
  const scenarioSegments = [...document.querySelectorAll('[data-scenario]')];
  const scenarioEvidence = document.getElementById('scenarioEvidence');
  const scenarioCta = document.getElementById('scenarioCta');
  let activeScenario = 'production';
  let lastCaseTrigger = null;

  const applyScenarioToForm = (scenarioKey) => {
    const scenario = scenarioConfig[scenarioKey];
    if (!scenario) return;
    const projectTypeSelect = document.querySelector('#contactForm select[name="type"]');
    if (projectTypeSelect instanceof HTMLSelectElement) {
      const wanted = scenario.projectType;
      const option = [...projectTypeSelect.options].find((item) => item.textContent?.trim() === wanted);
      projectTypeSelect.value = option?.value || wanted;
    }
    const mainTaskField = document.getElementById('taskField');
    if (mainTaskField instanceof HTMLTextAreaElement) {
      mainTaskField.placeholder = scenario.taskHint;
    }
    if (scenarioCta instanceof HTMLAnchorElement) {
      scenarioCta.textContent = scenario.cta;
    }
    if (scenarioEvidence) {
      scenarioEvidence.innerHTML = `
        <span><strong>${scenario.evidence.metric}</strong></span>
        <span>${scenario.evidence.sla}</span>
        <span>${scenario.evidence.output}</span>
      `;
    }
    scenarioSegments.forEach((button) => {
      const isCurrent = button.getAttribute('data-scenario') === scenarioKey;
      button.classList.toggle('is-active', isCurrent);
      button.setAttribute('aria-pressed', String(isCurrent));
    });
  };

  const resolveScenarioFromCase = (item) => {
    if (!item) return;
    const nextScenario = item.scenario && scenarioConfig[item.scenario] ? item.scenario : activeScenario;
    activeScenario = nextScenario;
    applyScenarioToForm(activeScenario);
  };

  const setCaseFilter = (filter) => {
    activeCaseFilter = filter;
    let selectedTabId = '';
    filterButtons.forEach((item) => {
      const isCurrent = (item.dataset.filter || 'all') === filter;
      item.classList.toggle('is-active', isCurrent);
      item.setAttribute('aria-selected', String(isCurrent));
      item.setAttribute('tabindex', isCurrent ? '0' : '-1');
      if (isCurrent) selectedTabId = item.id;
    });
    if (casesPanel && selectedTabId) {
      casesPanel.setAttribute('aria-labelledby', selectedTabId);
    }
  };

  const renderCases = (filter = 'all', query = '') => {
    if (!caseGrid) return;
    caseGrid.innerHTML = '';
    const filteredByType = filter === 'all' ? cases : cases.filter((item) => Array.isArray(item.type) && item.type.includes(filter));
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = normalizedQuery
      ? filteredByType.filter((item) => [item.title, item.problem, item.solution, item.result, item.taskType, item.categoryLabel, ...(item.industryTags || []), item.scenario, item.urgencyLevel, item.resultType].join(' ').toLowerCase().includes(normalizedQuery))
      : filteredByType;

    if (casesCount) {
      casesCount.textContent = `Найдено кейсов: ${filtered.length}`;
    }

    if (!filtered.length) {
      caseGrid.innerHTML = '<article class="card"><h3>Нет кейсов в этой категории</h3><p>Выберите другой фильтр или отправьте задачу — подберем релевантные примеры.</p></article>';
      return;
    }

    filtered.forEach((item) => caseGrid.appendChild(renderCaseCard(item)));
  };

  const renderCaseDetail = (caseId, pushState = true) => {
    const selected = cases.find((item) => item.id === caseId);
    if (!selected || !caseDetail) return;

    const timeline = toText(selected.timeline);
    const budget = toText(selected.budget);
    resolveScenarioFromCase(selected);

    caseDetail.hidden = false;
    caseDetail.innerHTML = `
      <h3 id="caseDetailHeading" tabindex="-1">${toText(selected.title)}</h3>
      <p>${toText(selected.problem)}</p>
      <div class="modal-grid">
        <div><strong>Тип задачи</strong><p>${toText(selected.taskType)}</p></div>
        <div><strong>Что сделали</strong><p>${toText(selected.solution)}</p></div>
        <div><strong>Результат</strong><p>${toText(selected.result)}</p></div>
        <div><strong>Галерея</strong><p>${toText(selected.gallery)}</p></div>
        <div><strong>Срок / бюджет</strong><p>${timeline} · ${budget}</p></div>
        <div><strong>Выходной результат</strong><p>${toText(selected.output)}</p></div>
      </div>
      <p class="case-detail-actions">
        <button class="btn btn-secondary" type="button" id="caseDetailBackBtn">Назад к списку кейсов</button>
        <a class="btn btn-secondary" href="#contact">Обсудить похожий проект</a>
      </p>
    `;

    const nextUrl = `${window.location.pathname}?case=${encodeURIComponent(caseId)}#cases`;
    if (pushState) {
      window.history.pushState({ caseId }, '', nextUrl);
    }
    document.title = `${toText(selected.title)} — кейс Step3D`;
    if (canonicalLink instanceof HTMLLinkElement) {
      canonicalLink.href = `${window.location.origin}${nextUrl}`;
    }
    caseDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('caseDetailHeading')?.focus();
    document.getElementById('caseDetailBackBtn')?.addEventListener('click', () => {
      if (window.history.state?.caseId) {
        window.history.back();
      } else {
        clearCaseDetail(true);
      }
    });
  };

  const clearCaseDetail = (pushState = true) => {
    if (caseDetail) {
      caseDetail.hidden = true;
      caseDetail.innerHTML = '';
    }
    document.title = baseTitle;
    if (canonicalLink instanceof HTMLLinkElement) {
      canonicalLink.href = `${window.location.origin}${window.location.pathname}`;
    }
    if (pushState) {
      window.history.pushState({}, '', `${window.location.pathname}#cases`);
    }
    if (lastCaseTrigger instanceof HTMLElement && document.contains(lastCaseTrigger)) {
      lastCaseTrigger.focus();
    } else {
      filterButtons.find((button) => button.getAttribute('aria-selected') === 'true')?.focus();
    }
  };

  let activeCaseFilter = 'all';

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter || 'all';
      setCaseFilter(filter);
      renderCases(filter, caseSearch instanceof HTMLInputElement ? caseSearch.value : '');
      button.focus();
    });

    button.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const currentIndex = filterButtons.indexOf(button);
      if (currentIndex < 0) return;
      let nextIndex = currentIndex;
      if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % filterButtons.length;
      if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + filterButtons.length) % filterButtons.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = filterButtons.length - 1;
      const nextButton = filterButtons[nextIndex];
      if (!(nextButton instanceof HTMLButtonElement)) return;
      nextButton.focus();
      nextButton.click();
    });
  });

  caseGrid?.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.matches('.case-link')) {
      event.preventDefault();
      lastCaseTrigger = target;
      renderCaseDetail(target.dataset.caseId || '');
    }
  });

  caseSearch?.addEventListener('input', () => {
    renderCases(activeCaseFilter, caseSearch instanceof HTMLInputElement ? caseSearch.value : '');
  });

  scenarioSegments.forEach((segment) => {
    segment.addEventListener('click', () => {
      const scenario = segment.getAttribute('data-scenario') || 'production';
      activeScenario = scenario;
      applyScenarioToForm(activeScenario);
      const relatedCase = cases.find((item) => item.scenario === activeScenario);
      if (relatedCase) {
        setCaseFilter(relatedCase.type?.[0] || 'all');
        renderCases(activeCaseFilter, caseSearch instanceof HTMLInputElement ? caseSearch.value : '');
      }
      pushAnalytics('scenario_switch', { scenario: activeScenario });
    });
  });

  const closeCaseModal = () => {
    caseModal?.close();
    body.classList.remove('modal-open');
  };

  caseModalClose?.addEventListener('click', closeCaseModal);
  caseModal?.addEventListener('click', (event) => {
    if (event.target === caseModal) closeCaseModal();
  });

  setCaseFilter(activeCaseFilter);
  applyScenarioToForm(activeScenario);
  renderCases(activeCaseFilter);

  const initialCaseId = new URLSearchParams(window.location.search).get('case');
  if (initialCaseId) {
    renderCaseDetail(initialCaseId, false);
  }

  window.addEventListener('popstate', () => {
    const caseId = new URLSearchParams(window.location.search).get('case');
    if (caseId) {
      renderCaseDetail(caseId, false);
    } else {
      clearCaseDetail(false);
    }
  });

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
  const projectWizard = document.getElementById('projectWizard');
  const wizardForm = document.getElementById('projectWizardForm');
  const wizardProgressBar = document.getElementById('wizardProgressBar');
  const wizardStepLabel = document.getElementById('wizardStepLabel');
  const wizardPrevBtn = document.getElementById('wizardPrevBtn');
  const wizardNextBtn = document.getElementById('wizardNextBtn');
  const wizardFooter = document.getElementById('wizardFooter');
  const wizardFallbackToggle = document.getElementById('wizardFallbackToggle');
  const wizardSubmitStatus = document.getElementById('wizardSubmitStatus');
  const heroWizardTriggers = [...document.querySelectorAll('[data-open-wizard]')];
  const wizardTaskField = document.getElementById('wizardTaskField');
  const wizardTaskCounter = document.getElementById('wizardTaskCounter');

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

  contactForm?.addEventListener('input', (event) => {
    if (!kpiState.startedAt && event.target instanceof HTMLElement && event.target.closest('#contactForm')) {
      kpiState.startedAt = Date.now();
      pushAnalytics('kpi_form_start', { scenario: activeScenario });
    }
    updateFormProgress();
  });
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

  const pushAnalytics = (eventName, payload = {}) => {
    const eventPayload = {
      event: eventName,
      timestamp: new Date().toISOString(),
      ...payload,
    };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventPayload);
    window.dispatchEvent(new CustomEvent('step3d:analytics', { detail: eventPayload }));
  };

  const kpiState = {
    startedAt: 0,
    ctaClicks: 0,
    reachedContact: false,
  };

  document.querySelectorAll('a[href="#contact"], button[data-open-wizard]').forEach((cta) => {
    cta.addEventListener('click', () => {
      kpiState.ctaClicks += 1;
      pushAnalytics('kpi_cta_click', { total: kpiState.ctaClicks, scenario: activeScenario });
    });
  });

  const contactSection = document.getElementById('contact');
  if ('IntersectionObserver' in window && contactSection) {
    const contactObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || kpiState.reachedContact) return;
        kpiState.reachedContact = true;
        pushAnalytics('kpi_scroll_depth_contact', { scenario: activeScenario });
      });
    }, { threshold: 0.4 });
    contactObserver.observe(contactSection);
  }

  const wizardState = {
    step: 1,
    data: {
      type: '',
      timeline: '',
      outcome: '',
      task: '',
      name: '',
      company: '',
      contact: '',
      consent: false,
    },
    submitted: false,
  };

  const wizardLabels = {
    1: 'Шаг 1 из 3 · Тип задачи',
    2: 'Шаг 2 из 3 · Сроки и результат',
    3: 'Шаг 3 из 3 · Контакт',
  };

  const getWizardErrorNode = (step) => document.getElementById(`wizardErrorStep${step}`);

  const hideWizardError = (step) => {
    const node = getWizardErrorNode(step);
    if (!node) return;
    node.hidden = true;
  };

  const showWizardError = (step, message) => {
    const node = getWizardErrorNode(step);
    if (!node) return;
    if (message) node.textContent = message;
    node.hidden = false;
  };

  const updateWizardTaskCounter = () => {
    if (!(wizardTaskField instanceof HTMLTextAreaElement) || !wizardTaskCounter) return;
    wizardTaskCounter.textContent = `${wizardTaskField.value.length} / ${wizardTaskField.maxLength || 700}`;
  };

  const syncWizardFromDom = () => {
    if (!(wizardForm instanceof HTMLFormElement)) return;
    const formData = new FormData(wizardForm);
    wizardState.data.type = String(formData.get('wizardType') || '');
    wizardState.data.timeline = String(formData.get('wizardTimeline') || '');
    wizardState.data.outcome = String(formData.get('wizardOutcome') || '');
    wizardState.data.task = normalizeTask(String(formData.get('wizardTask') || ''));
    wizardState.data.name = normalizeSpaces(String(formData.get('wizardName') || ''));
    wizardState.data.company = normalizeSpaces(String(formData.get('wizardCompany') || ''));
    wizardState.data.contact = normalizeSpaces(String(formData.get('wizardContact') || ''));
    wizardState.data.consent = Boolean(formData.get('wizardConsent'));
  };

  const syncWizardToDom = () => {
    if (!(wizardForm instanceof HTMLFormElement)) return;
    const setValue = (name, value) => {
      const field = wizardForm.elements.namedItem(name);
      if (!field) return;
      if (field instanceof RadioNodeList) {
        [...field].forEach((radio) => {
          if (radio instanceof HTMLInputElement) {
            radio.checked = radio.value === value;
          }
        });
        return;
      }
      if (field instanceof HTMLInputElement && field.type === 'checkbox') {
        field.checked = Boolean(value);
        return;
      }
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
        field.value = String(value || '');
      }
    };

    setValue('wizardType', wizardState.data.type);
    setValue('wizardTimeline', wizardState.data.timeline);
    setValue('wizardOutcome', wizardState.data.outcome);
    setValue('wizardTask', wizardState.data.task);
    setValue('wizardName', wizardState.data.name);
    setValue('wizardCompany', wizardState.data.company);
    setValue('wizardContact', wizardState.data.contact);
    setValue('wizardConsent', wizardState.data.consent);
    updateWizardTaskCounter();
  };

  const applyWizardCaseFilter = () => {
    const nextFilter = wizardState.data.type || 'all';
    setCaseFilter(nextFilter);
    renderCases(nextFilter, caseSearch instanceof HTMLInputElement ? caseSearch.value : '');
  };

  const setWizardStatus = (state, message) => {
    if (!wizardSubmitStatus) return;
    wizardSubmitStatus.hidden = false;
    wizardSubmitStatus.textContent = message;
    wizardSubmitStatus.classList.remove('is-loading', 'is-success', 'is-error');
    wizardSubmitStatus.classList.add(`is-${state}`);
  };

  const updateWizardUI = () => {
    if (!projectWizard) return;
    projectWizard.setAttribute('data-state', `step-${wizardState.step}`);
    if (wizardStepLabel) wizardStepLabel.textContent = wizardLabels[wizardState.step];
    if (wizardProgressBar) wizardProgressBar.style.width = `${(wizardState.step / 3) * 100}%`;
    [...projectWizard.querySelectorAll('.wizard-step')].forEach((stepNode) => {
      const isCurrent = Number(stepNode.getAttribute('data-step')) === wizardState.step;
      stepNode.classList.toggle('is-active', isCurrent);
    });
    if (wizardPrevBtn) wizardPrevBtn.disabled = wizardState.step === 1;
    if (wizardNextBtn) wizardNextBtn.textContent = wizardState.step === 3 ? 'Отправить заявку' : 'Далее';
    hideWizardError(wizardState.step);
  };

  const validateWizardStep = (step) => {
    syncWizardFromDom();
    if (step === 1) {
      const valid = Boolean(wizardState.data.type);
      if (!valid) {
        showWizardError(1, 'Выберите тип задачи, чтобы перейти к релевантным кейсам.');
      }
      if (valid) {
        applyWizardCaseFilter();
      }
      return valid;
    }

    if (step === 2) {
      const valid = Boolean(wizardState.data.timeline) && Boolean(wizardState.data.outcome) && validateRequired(wizardState.data.task, 10);
      if (!valid) {
        showWizardError(2, 'Уточните срок, результат и задачу (минимум 10 символов).');
      }
      return valid;
    }

    if (step === 3) {
      const valid = validateRequired(wizardState.data.name) && validateRequired(wizardState.data.contact, 3) && wizardState.data.consent;
      if (!valid) {
        showWizardError(3, 'Проверьте имя, контакт и согласие на обработку данных.');
      }
      return valid;
    }
    return true;
  };

  const goToWizardStep = (nextStep, source = 'navigation') => {
    wizardState.step = Math.max(1, Math.min(3, nextStep));
    syncWizardToDom();
    updateWizardUI();
    pushAnalytics('wizard_step_view', { step: wizardState.step, source, type: wizardState.data.type || 'none' });
  };

  const submitWizard = async () => {
    if (!(wizardForm instanceof HTMLFormElement)) return;
    if (!validateWizardStep(3)) {
      pushAnalytics('wizard_validation_error', { step: 3, reason: 'contact_fields' });
      return;
    }

    const message = [
      'Новая заявка через мастер Step3D',
      `Тип задачи: ${wizardState.data.type || '—'}`,
      `Желаемый срок: ${wizardState.data.timeline || '—'}`,
      `Ожидаемый результат: ${wizardState.data.outcome || '—'}`,
      `Описание: ${wizardState.data.task || '—'}`,
      `Имя: ${wizardState.data.name || '—'}`,
      `Компания/роль: ${wizardState.data.company || '—'}`,
      `Контакт: ${wizardState.data.contact || '—'}`,
    ].join('\n');

    setWizardStatus('loading', 'Формируем заявку и готовим отправку…');
    if (wizardNextBtn instanceof HTMLButtonElement) {
      wizardNextBtn.disabled = true;
      wizardNextBtn.setAttribute('aria-busy', 'true');
    }
    pushAnalytics('wizard_submit_attempt', { step: 3, type: wizardState.data.type || 'none' });

    try {
      await navigator.clipboard.writeText(message);
      window.location.href = `mailto:hello@step3d.pro?subject=${encodeURIComponent('Новая заявка Step3D (мастер)')}&body=${encodeURIComponent(message)}`;
      wizardState.submitted = true;
      setWizardStatus('success', 'Заявка подготовлена. Проверьте письмо и отправьте его — после этого мы свяжемся с вами.');
      pushAnalytics('wizard_submit_success', { type: wizardState.data.type || 'none' });
      wizardForm.reset();
      wizardState.step = 1;
      wizardState.data = { type: '', timeline: '', outcome: '', task: '', name: '', company: '', contact: '', consent: false };
      applyWizardCaseFilter();
      updateWizardUI();
    } catch {
      setWizardStatus('error', 'Не удалось сформировать отправку автоматически. Напишите нам на hello@step3d.pro.');
      pushAnalytics('wizard_submit_error', { type: wizardState.data.type || 'none' });
    } finally {
      if (wizardNextBtn instanceof HTMLButtonElement) {
        wizardNextBtn.disabled = false;
        wizardNextBtn.removeAttribute('aria-busy');
      }
    }
  };

  if (projectWizard && wizardForm) {
    goToWizardStep(1, 'init');
    applyWizardCaseFilter();
    wizardTaskField?.addEventListener('input', updateWizardTaskCounter);
    wizardForm.addEventListener('input', () => {
      syncWizardFromDom();
      hideWizardError(wizardState.step);
    });
    wizardForm.addEventListener('change', () => {
      syncWizardFromDom();
      if (wizardState.data.type) applyWizardCaseFilter();
    });

    wizardPrevBtn?.addEventListener('click', () => {
      syncWizardFromDom();
      if (wizardState.step > 1) {
        pushAnalytics('wizard_step_back', { from: wizardState.step, to: wizardState.step - 1, type: wizardState.data.type || 'none' });
        goToWizardStep(wizardState.step - 1, 'back');
      }
    });

    wizardNextBtn?.addEventListener('click', () => {
      syncWizardFromDom();
      const currentStep = wizardState.step;
      const isValid = validateWizardStep(currentStep);
      if (!isValid) {
        pushAnalytics('wizard_validation_error', { step: currentStep, type: wizardState.data.type || 'none' });
        return;
      }
      if (currentStep < 3) {
        pushAnalytics('wizard_step_next', { from: currentStep, to: currentStep + 1, type: wizardState.data.type || 'none' });
        goToWizardStep(currentStep + 1, 'next');
        return;
      }
      submitWizard();
    });

    heroWizardTriggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        pushAnalytics('wizard_launch', { source: trigger.getAttribute('data-open-wizard') || 'unknown' });
      });
    });

    wizardFallbackToggle?.addEventListener('click', () => {
      contactForm?.classList.toggle('is-fallback-hidden');
      const isVisible = !contactForm?.classList.contains('is-fallback-hidden');
      wizardFallbackToggle.textContent = isVisible ? 'Скрыть классическую форму' : 'Заполнить классическую форму';
      pushAnalytics('wizard_toggle_fallback', { fallbackVisible: Boolean(isVisible) });
    });

    window.addEventListener('beforeunload', () => {
      const hasProgress = Boolean(wizardState.data.type || wizardState.data.task || wizardState.data.contact);
      if (hasProgress && !wizardState.submitted) {
        pushAnalytics('wizard_dropoff', { step: wizardState.step, type: wizardState.data.type || 'none' });
      }
    });
  }

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

    const activeScenarioConfig = scenarioConfig[activeScenario] || scenarioConfig.production;
    setSubmitState('loading', activeScenarioConfig.statusLoading);
    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
      submitButton.setAttribute('aria-busy', 'true');
    }

    try {
      await navigator.clipboard.writeText(message);
      window.location.href = `mailto:hello@step3d.pro?subject=${encodeURIComponent('Новая заявка Step3D')}&body=${encodeURIComponent(message)}`;
      setSubmitState('success', activeScenarioConfig.statusSuccess);
      contactForm.reset();
      pushAnalytics('kpi_form_completion', { scenario: activeScenario });
      if (kpiState.startedAt) {
        pushAnalytics('kpi_time_to_submit', { scenario: activeScenario, seconds: Math.round((Date.now() - kpiState.startedAt) / 1000) });
      }
      kpiState.startedAt = 0;
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
