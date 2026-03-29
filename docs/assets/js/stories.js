window.STEP3D_STORIES = [
  {
    id: 'pipeline',
    title: 'Pipeline: от входных данных до готового изделия',
    subtitle: 'Интерактивный маршрут Step3D',
    scenarios: ['production', 'medtech', 'rnd', 'architecture'],
    slides: [
      { title: 'Scan / Input', text: 'Собираем исходные данные: скан, фото, CAD или физический образец.' },
      { title: 'CAD / Reverse', text: 'Превращаем геометрию в чистую редактируемую инженерную модель.' },
      { title: 'Prototype / Print', text: 'Выпускаем прототипы и малые серии с быстрыми итерациями.' },
      { title: 'Validation / Delivery', text: 'Контроль параметров, передача файлов, деталей и инструкций.' },
    ],
  },
  {
    id: 'production-line',
    title: 'Производство: аварийная деталь в сменном цикле',
    subtitle: 'Сценарий для инженерной службы и закупок',
    scenarios: ['production'],
    slides: [
      { title: 'Stop-loss', text: 'Фиксируем критичную геометрию узла и согласуем SLA по простою.' },
      { title: 'Reverse CAD', text: 'Собираем рабочую CAD-модель с допусками под текущую линию.' },
      { title: 'Pilot detail', text: 'Печатаем/обрабатываем тестовую деталь и проверяем посадки.' },
    ],
  },
  {
    id: 'medtech-validation',
    title: 'Медтех: прототип под валидацию и сборку',
    subtitle: 'Сценарий продуктовой команды и QA',
    scenarios: ['medtech'],
    slides: [
      { title: 'Регуляторные ограничения', text: 'Фиксируем требования по материалам, допускам и трассируемости изменений.' },
      { title: 'Итерации корпуса', text: 'Делаем несколько ревизий прототипов и эргономические тесты.' },
      { title: 'Пакет на пилот', text: 'Передаем STEP/STL, протокол отклонений и рекомендации к следующей серии.' },
    ],
  },
  {
    id: 'rnd-hypothesis',
    title: 'R&D: быстрый цикл проверки гипотез',
    subtitle: 'Сценарий для лаборатории и опытного участка',
    scenarios: ['rnd'],
    slides: [
      { title: 'Гипотеза', text: 'Формируем критерии успеха и ограничения эксперимента.' },
      { title: 'Сборка артефакта', text: 'Строим цифровой и физический артефакт для испытания.' },
      { title: 'Решение go/no-go', text: 'Собираем метрики, документируем выводы и следующий технический шаг.' },
    ],
  },
  {
    id: 'architecture-bid',
    title: 'Архитектура: серия модулей к защите проекта',
    subtitle: 'Сценарий для бюро и тендерных команд',
    scenarios: ['architecture'],
    slides: [
      { title: 'ТЗ и дедлайн', text: 'Размечаем макет на модули и критичные зоны визуализации.' },
      { title: 'Стабильная серия', text: 'Выводим единый профиль печати и контроль повторяемости.' },
      { title: 'Пакет для защиты', text: 'Передаем комплект модулей, резервные STL и инструкцию по сборке.' },
    ],
  },
];

document.addEventListener('DOMContentLoaded', () => {
  const stories = Array.isArray(window.STEP3D_STORIES) ? window.STEP3D_STORIES : [];
  const storyList = document.getElementById('storyList');
  const storyStage = document.getElementById('storyStage');

  if (!storyList || !storyStage || !stories.length) return;

  const scenarioLabels = {
    all: 'Все сценарии',
    production: 'Производство',
    medtech: 'Медтех',
    rnd: 'R&D',
    architecture: 'Архитектура',
  };

  let activeStoryId = stories[0].id;
  let activeSlideIndex = 0;
  let activeScenario = 'all';

  const getFilteredStories = () => (activeScenario === 'all'
    ? stories
    : stories.filter((story) => Array.isArray(story.scenarios) && story.scenarios.includes(activeScenario)));

  const getStoryById = (storyId) => getFilteredStories().find((story) => story.id === storyId) || getFilteredStories()[0] || stories[0];

  const createStoryCard = (story) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'story-card';
    button.dataset.storyId = story.id;
    button.innerHTML = `
      <span class="story-card-title">${story.title}</span>
      <span class="story-card-subtitle">${story.subtitle}</span>
      <span class="story-card-count">${story.slides.length} этапов</span>
    `;
    return button;
  };

  const renderScenarioSwitchers = () => {
    const switcher = document.createElement('div');
    switcher.className = 'story-scenario-switchers';
    Object.entries(scenarioLabels).forEach(([key, label]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `chip chip-btn ${activeScenario === key ? 'is-active' : ''}`;
      button.dataset.storyScenario = key;
      button.textContent = label;
      switcher.appendChild(button);
    });
    storyList.appendChild(switcher);
  };

  const renderStoryCards = () => {
    const filteredStories = getFilteredStories();
    storyList.querySelectorAll('.story-card').forEach((node) => node.remove());
    filteredStories.forEach((story) => storyList.appendChild(createStoryCard(story)));
    if (!filteredStories.some((story) => story.id === activeStoryId)) {
      activeStoryId = filteredStories[0]?.id || stories[0].id;
      activeSlideIndex = 0;
    }
  };

  const setActiveStoryButton = () => {
    storyList.querySelectorAll('.story-card').forEach((button) => {
      const isActive = button.dataset.storyId === activeStoryId;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
    storyList.querySelectorAll('[data-story-scenario]').forEach((button) => {
      const isActive = button.getAttribute('data-story-scenario') === activeScenario;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  };

  const renderStoryStage = () => {
    const story = getStoryById(activeStoryId);
    const slides = story.slides || [];
    const safeIndex = Math.min(activeSlideIndex, Math.max(slides.length - 1, 0));
    const slide = slides[safeIndex];
    if (!slide) return;

    const timelineSteps = slides
      .map((item, index) => `
        <button type="button" class="story-step ${index === safeIndex ? 'is-current' : ''}" data-step-index="${index}">
          <span>${String(index + 1).padStart(2, '0')}</span>
          <strong>${item.title}</strong>
        </button>
      `)
      .join('');

    storyStage.innerHTML = `
      <header class="story-stage-head">
        <p class="eyebrow">Story Mode · ${scenarioLabels[activeScenario] || scenarioLabels.all}</p>
        <h3>${story.title}</h3>
        <p>${story.subtitle}</p>
      </header>
      <div class="story-stage-main">
        <div class="story-stage-media">
          <div class="story-graphic" aria-hidden="true">
            <span class="story-graphic-ring"></span>
            <span class="story-graphic-core"></span>
            <span class="story-graphic-grid"></span>
          </div>
        </div>
        <div class="story-stage-content">
          <p class="story-slide-index">Этап ${safeIndex + 1} из ${slides.length}</p>
          <h4>${slide.title}</h4>
          <p>${slide.text}</p>
          <div class="story-controls">
            <button type="button" class="btn btn-secondary story-prev" ${safeIndex === 0 ? 'disabled' : ''}>Назад</button>
            <button type="button" class="btn btn-primary story-next" ${safeIndex === slides.length - 1 ? 'disabled' : ''}>Дальше</button>
          </div>
        </div>
      </div>
      <div class="story-timeline">${timelineSteps}</div>
    `;
  };

  renderScenarioSwitchers();
  renderStoryCards();
  setActiveStoryButton();
  renderStoryStage();

  storyList.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const scenarioBtn = target.closest('[data-story-scenario]');
    if (scenarioBtn) {
      activeScenario = scenarioBtn.getAttribute('data-story-scenario') || 'all';
      activeSlideIndex = 0;
      renderStoryCards();
      setActiveStoryButton();
      renderStoryStage();
      return;
    }

    const card = target.closest('.story-card');
    if (!card) return;
    activeStoryId = card.dataset.storyId || activeStoryId;
    activeSlideIndex = 0;
    setActiveStoryButton();
    renderStoryStage();
  });

  storyStage.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const story = getStoryById(activeStoryId);
    const maxIndex = story.slides.length - 1;

    if (target.closest('.story-prev')) {
      activeSlideIndex = Math.max(activeSlideIndex - 1, 0);
      renderStoryStage();
      return;
    }
    if (target.closest('.story-next')) {
      activeSlideIndex = Math.min(activeSlideIndex + 1, maxIndex);
      renderStoryStage();
      return;
    }

    const step = target.closest('.story-step');
    if (step) {
      const parsedIndex = Number.parseInt(step.dataset.stepIndex || '0', 10);
      activeSlideIndex = Number.isNaN(parsedIndex) ? 0 : Math.max(0, Math.min(parsedIndex, maxIndex));
      renderStoryStage();
    }
  });
});
