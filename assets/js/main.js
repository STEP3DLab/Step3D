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
  const fallbackText = '—';
  const toText = (value, fallback = fallbackText) => {
    if (typeof value === 'string') {
      const normalized = value.trim();
      return normalized || fallback;
    }
    return fallback;
  };

  const cases = Array.isArray(window.STEP3D_CASES) ? window.STEP3D_CASES : [];

  const renderCaseCard = (item) => {
    const card = document.createElement('article');
    card.className = 'case-card';
    const timeline = toText(item.timeline);
    card.innerHTML = `
      <div class="case-top">
        <p class="case-type">${toText(item.categoryLabel)}</p>
        <p class="case-meta">${timeline}</p>
      </div>
      <h3>${toText(item.title)}</h3>
      <p>${toText(item.problem)}</p>
      <p class="case-meta">Формат: ${toText(item.output)}</p>
      <button class="case-link" data-case-id="${item.id}" type="button">Открыть кейс →</button>
    `;
    return card;
  };

  const renderCases = (filter = 'all') => {
    if (!caseGrid) return;

    const filtered = cases.filter((item) => {
      const types = Array.isArray(item?.type) ? item.type : [];
      return filter === 'all' || types.includes(filter);
    });
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

    const timeline = toText(selected.timeline);
    const budget = toText(selected.budget);
    const timelineBudget = timeline === fallbackText && budget === fallbackText
      ? fallbackText
      : `${timeline} · ${budget}`;

    caseModalContent.innerHTML = `
      <p class="case-type">${toText(selected.categoryLabel)}</p>
      <h3 class="modal-title">${toText(selected.title)}</h3>
      <p>${toText(selected.problem)}</p>
      <div class="modal-grid">
        <div><strong>Тип задачи</strong><p>${toText(selected.taskType)}</p></div>
        <div><strong>Что сделали</strong><p>${toText(selected.solution)}</p></div>
        <div><strong>Результат</strong><p>${toText(selected.result)}</p></div>
        <div><strong>Срок / бюджет</strong><p>${timelineBudget}</p></div>
      </div>
      <p class="modal-format"><strong>Формат результата:</strong> ${toText(selected.output)}</p>
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

  const normalizeStorySlide = (storyId, slide, slideIndex) => {
    if (!slide || typeof slide !== 'object') {
      console.warn(`[STEP3D_STORIES] Пропущен слайд ${slideIndex + 1} в истории "${storyId}": ожидается объект.`);
      return null;
    }

    const title = toText(slide.title);
    const text = toText(slide.text);

    if (title === fallbackText || text === fallbackText) {
      console.warn(`[STEP3D_STORIES] Пропущен слайд ${slideIndex + 1} в истории "${storyId}": обязательны поля title и text.`);
      return null;
    }

    let media;
    if (slide.media && typeof slide.media === 'object') {
      const mediaType = toText(slide.media.type, '');
      const mediaSrc = toText(slide.media.src, '');
      if ((mediaType === 'image' || mediaType === 'video') && mediaSrc) {
        media = { type: mediaType, src: mediaSrc };
      } else {
        console.warn(`[STEP3D_STORIES] Игнорируется media у слайда ${slideIndex + 1} истории "${storyId}": нужны type (image|video) и src.`);
      }
    }

    return { title, text, media };
  };

  const validateStories = (rawStories) => {
    if (!Array.isArray(rawStories)) {
      console.warn('[STEP3D_STORIES] Ожидался массив историй. Загружен пустой набор.');
      return {};
    }

    return rawStories.reduce((acc, story, storyIndex) => {
      if (!story || typeof story !== 'object') {
        console.warn(`[STEP3D_STORIES] Пропущена запись #${storyIndex + 1}: ожидается объект.`);
        return acc;
      }

      const id = toText(story.id, '');
      const title = toText(story.title, '');
      const slidesRaw = Array.isArray(story.slides) ? story.slides : [];
      const slides = slidesRaw
        .map((slide, slideIndex) => normalizeStorySlide(id || `#${storyIndex + 1}`, slide, slideIndex))
        .filter(Boolean);

      if (!id || !title || !slides.length) {
        console.warn(`[STEP3D_STORIES] Пропущена история #${storyIndex + 1}: обязательны id/title и минимум один валидный слайд.`);
        return acc;
      }

      acc[id] = {
        id,
        title,
        subtitle: toText(story.subtitle, 'История направления'),
        slides,
      };
      return acc;
    }, {});
  };

  const stories = validateStories(window.STEP3D_STORIES);


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

    const slides = Array.isArray(currentStory.slides) ? currentStory.slides : [];
    if (!slides.length) return;
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
        <p class="case-type">${toText(currentStory.subtitle, 'История направления')}</p>
        <h3 class="modal-title">${toText(currentStory.title)}</h3>
        <article class="story-slide" data-slide="${index}">
          <h4>${toText(slide.title)}</h4>
          <p>${toText(slide.text)}</p>
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
