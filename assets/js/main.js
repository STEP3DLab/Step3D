document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const progress = document.getElementById('scrollProgress');
  const navLinks = [...document.querySelectorAll('.nav a')];
  const sections = [...document.querySelectorAll('main section[id]')];

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const onScroll = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) {
      progress.style.width = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
    }

    let activeId = '';
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= 140) activeId = section.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${activeId}`);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.querySelectorAll('.faq-item').forEach((item) => {
    const button = item.querySelector('.faq-btn');
    button?.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');
      document.querySelectorAll('.faq-item').forEach((el) => {
        el.classList.remove('is-open');
        el.querySelector('.faq-btn')?.setAttribute('aria-expanded', 'false');
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
  const storyModal = document.getElementById('storyModal');
  const storyModalContent = document.getElementById('storyModalContent');
  const storyModalClose = document.getElementById('storyModalClose');
  const cases = window.STEP3D_CASES || [];

  const renderCaseCard = (item) => {
    const card = document.createElement('article');
    card.className = 'case-card';
    card.innerHTML = `
      <div class="case-top">
        <p class="case-type">${item.categoryLabel}</p>
        <p class="case-meta">${item.timeline}</p>
      </div>
      <h3>${item.title}</h3>
      <p>${item.problem}</p>
      <p class="case-meta">Формат: ${item.output}</p>
      <button class="case-link" data-case-id="${item.id}" type="button">Открыть кейс →</button>
    `;
    return card;
  };

  const renderCases = (filter = 'all') => {
    if (!caseGrid) return;

    const filtered = cases.filter((item) => filter === 'all' || item.type.includes(filter));
    caseGrid.innerHTML = '';

    if (!filtered.length) {
      caseGrid.innerHTML = '<article class="card"><h3>Кейсы в этой категории добавляются</h3><p>Выберите другой фильтр или свяжитесь с нами — покажем релевантные примеры под вашу задачу.</p></article>';
      return;
    }

    filtered.forEach((item) => caseGrid.appendChild(renderCaseCard(item)));
  };

  const openCaseModal = (caseId) => {
    const selected = cases.find((item) => item.id === caseId);
    if (!selected || !caseModal || !caseModalContent) return;

    caseModalContent.innerHTML = `
      <p class="case-type">${selected.categoryLabel}</p>
      <h3 class="modal-title">${selected.title}</h3>
      <p>${selected.problem}</p>
      <div class="modal-grid">
        <div><strong>Тип задачи</strong><p>${selected.taskType}</p></div>
        <div><strong>Что сделали</strong><p>${selected.solution}</p></div>
        <div><strong>Результат</strong><p>${selected.result}</p></div>
        <div><strong>Срок / бюджет</strong><p>${selected.timeline} · ${selected.budget}</p></div>
      </div>
      <p class="modal-format"><strong>Формат результата:</strong> ${selected.output}</p>
    `;

    caseModal.showModal();
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
    if (!(target instanceof HTMLElement)) return;
    if (target.matches('.case-link')) {
      openCaseModal(target.dataset.caseId);
    }
  });

  caseModalClose?.addEventListener('click', () => caseModal?.close());
  caseModal?.addEventListener('click', (event) => {
    if (event.target === caseModal) caseModal.close();
  });

  renderCases();

  const stories = {
    pipeline: {
      title: 'Pipeline: от входных данных до готового изделия',
      subtitle: 'Интерактивный маршрут Step3D',
      slides: [
        { title: 'Scan / Input', text: 'Собираем исходные данные: скан, фото, CAD или физический образец.' },
        { title: 'CAD / Reverse', text: 'Превращаем геометрию в чистую редактируемую инженерную модель.' },
        { title: 'Prototype / Print', text: 'Выпускаем прототипы и малые серии с быстрыми итерациями.' },
        { title: 'Validation / Delivery', text: 'Контроль параметров, передача файлов, деталей и инструкций.' },
        {
          title: 'Производственный обзор',
          text: 'Видео-формат для презентации маршрута и команды.',
          media: { type: 'video', src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' },
        },
      ],
    },
    scan: {
      title: '3D-сканирование',
      subtitle: 'История направления',
      slides: [
        { title: 'Подготовка объекта', text: 'Фиксируем базу, метки и зоны критической точности.' },
        { title: 'Съёмка геометрии', text: 'Многопроходное сканирование для плотного и чистого облака точек.' },
        { title: 'Валидация', text: 'Проверяем отклонения и готовим результат под CAD/Reverse.' },
      ],
    },
    cad: {
      title: '3D-моделирование',
      subtitle: 'История направления',
      slides: [
        { title: 'ТЗ и допуски', text: 'Фиксируем ограничения и монтажные зоны под реальные условия.' },
        { title: 'Параметрическая сборка', text: 'Строим модель, которую можно безопасно править и масштабировать.' },
        { title: 'Документация', text: 'Готовим STEP/STL и пакет для передачи в производство.' },
      ],
    },
    reverse: {
      title: 'Реверсивный инжиниринг',
      subtitle: 'История направления',
      slides: [
        { title: 'Из облака в поверхность', text: 'Очищаем mesh и собираем точную геометрию под CAD-редактирование.' },
        { title: 'Функциональные узлы', text: 'Восстанавливаем посадки, резьбы и монтажные базы.' },
        { title: 'Проверка перед выпуском', text: 'Сравниваем модель с оригиналом и подтверждаем отклонения.' },
      ],
    },
    print: {
      title: '3D-печать',
      subtitle: 'История направления',
      slides: [
        { title: 'Выбор технологии', text: 'Подбираем FDM/SLA/SLS под механику, бюджет и срок.' },
        { title: 'Печать и постобработка', text: 'Стабильное качество слоёв и аккуратная финишная обработка.' },
        { title: 'Контроль серии', text: 'Сверяем повторяемость между деталями и готовим отгрузку.' },
      ],
    },
    prototype: {
      title: 'Прототипирование',
      subtitle: 'История направления',
      slides: [
        { title: 'Быстрый макет', text: 'Первый рабочий образец для проверки габаритов и логики сборки.' },
        { title: 'Итерации', text: 'Корректируем форму и узлы до уверенного результата.' },
        { title: 'Переход в серию', text: 'Фиксируем финальный вариант и маршрут выпуска.' },
      ],
    },
    engineering: {
      title: 'Инженерное сопровождение',
      subtitle: 'История направления',
      slides: [
        { title: 'Маршрут проекта', text: 'Разбиваем задачу на этапы с контрольными точками.' },
        { title: 'Координация команд', text: 'Сводим скан, CAD и производство в единую коммуникацию.' },
        { title: 'Финальный пакет', text: 'Передаём результат в формате, готовом к внедрению.' },
      ],
    },
  };

  let storyState = null;
  let storyTimer = 0;

  const stopStoryTimer = () => {
    window.clearTimeout(storyTimer);
  };

  const openStory = (storyId, startIndex = 0) => {
    const story = stories[storyId];
    if (!story || !storyModal || !storyModalContent) return;

    storyState = { storyId, index: startIndex };
    storyModal.classList.add('story-viewer-modal');
    renderStorySlide();
    storyModal.showModal();
  };

  const renderStorySlide = () => {
    if (!storyState || !storyModalContent) return;
    const currentStory = stories[storyState.storyId];
    if (!currentStory) return;

    const slides = currentStory.slides;
    const index = Math.max(0, Math.min(storyState.index, slides.length - 1));
    storyState.index = index;
    const slide = slides[index];
    const progressBars = slides
      .map((_, barIndex) => `<span class="story-progress-item${barIndex <= index ? ' is-active' : ''}"></span>`)
      .join('');

    const mediaMarkup = (() => {
      if (!slide.media) return '';
      if (slide.media.type === 'video') {
        return `<div class="story-media"><video src="${slide.media.src}" autoplay muted loop playsinline controls></video></div>`;
      }
      if (slide.media.type === 'image') {
        return `<div class="story-media"><img src="${slide.media.src}" alt="${slide.title}"></div>`;
      }
      return '';
    })();

    storyModalContent.innerHTML = `
      <div class="story-viewer">
        <div class="story-progress" aria-hidden="true">${progressBars}</div>
        <p class="case-type">${currentStory.subtitle}</p>
        <h3 class="modal-title">${currentStory.title}</h3>
        <article class="story-slide" data-slide="${index}">
          <h4>${slide.title}</h4>
          <p>${slide.text}</p>
          ${mediaMarkup}
        </article>
        <div class="story-controls">
          <button type="button" class="story-nav-btn" data-story-nav="prev">Назад</button>
          <span>${index + 1} / ${slides.length}</span>
          <button type="button" class="story-nav-btn" data-story-nav="next">Далее</button>
        </div>
      </div>
    `;

    stopStoryTimer();
    storyTimer = window.setTimeout(() => {
      if (!storyState) return;
      if (storyState.index >= slides.length - 1) {
        storyModal?.close();
        return;
      }
      storyState.index += 1;
      renderStorySlide();
    }, slide.media?.type === 'video' ? 9000 : 5000);
  };

  storyModalContent?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !storyState) return;
    if (!target.matches('[data-story-nav]')) return;

    const total = stories[storyState.storyId]?.slides.length || 0;
    if (target.dataset.storyNav === 'prev') {
      storyState.index = Math.max(0, storyState.index - 1);
    } else {
      storyState.index = Math.min(total - 1, storyState.index + 1);
    }
    renderStorySlide();
  });

  document.querySelectorAll('.story-launcher').forEach((card) => {
    const storyId = card.getAttribute('data-story-id');
    if (!storyId) return;

    card.addEventListener('click', () => openStory(storyId));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openStory(storyId);
      }
    });
  });

  const openLegacyStory = (title, text) => {
    if (!storyModal || !storyModalContent) return;
    const paragraphs = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `<p>${line}</p>`)
      .join('');

    storyModal.classList.remove('story-viewer-modal');
    storyModalContent.innerHTML = `
      <p class="case-type">Формат взаимодействия</p>
      <h3 class="modal-title">${title}</h3>
      <div class="modal-grid story-modal-grid">${paragraphs}</div>
    `;

    storyModal.showModal();
  };

  document.querySelectorAll('.story-card').forEach((card) => {
    const title = card.getAttribute('data-story-title') || 'Детали';
    const text = card.getAttribute('data-story-text') || '';

    card.addEventListener('click', () => openLegacyStory(title, text));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLegacyStory(title, text);
      }
    });
  });

  const closeStoryModal = () => {
    stopStoryTimer();
    storyState = null;
    storyModal?.close();
  };

  storyModalClose?.addEventListener('click', closeStoryModal);
  storyModal?.addEventListener('click', (event) => {
    if (event.target === storyModal) closeStoryModal();
  });

  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const attachedFiles = formData.getAll('attachments')
      .filter((file) => file && typeof file === 'object' && 'name' in file && file.name)
      .map((file) => file.name);
    const message = [
      'Новая заявка Step3D',
      `Имя: ${formData.get('name')}`,
      `Компания/роль: ${formData.get('company') || '—'}`,
      `Контакт: ${formData.get('contact')}`,
      `Тип задачи: ${formData.get('type')}`,
      `Описание: ${formData.get('task')}`,
      `Файлы: ${attachedFiles.length ? attachedFiles.join(', ') : 'не приложены'}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(message);
    } catch (_error) {
      // Clipboard API may be unavailable in some browsers.
    }

    const mailto = `mailto:hello@step3d.pro?subject=${encodeURIComponent('Заявка с сайта Step3D')}&body=${encodeURIComponent(message)}`;
    window.location.href = mailto;
  });
});
