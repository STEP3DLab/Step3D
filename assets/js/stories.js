window.STEP3D_STORIES = [
  {
    id: 'pipeline',
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
  {
    id: 'scan',
    title: '3D-сканирование',
    subtitle: 'История направления',
    slides: [
      { title: 'Подготовка объекта', text: 'Фиксируем базу, метки и зоны критической точности.' },
      { title: 'Съёмка геометрии', text: 'Многопроходное сканирование для плотного и чистого облака точек.' },
      { title: 'Валидация', text: 'Проверяем отклонения и готовим результат под CAD/Reverse.' },
    ],
  },
  {
    id: 'cad',
    title: '3D-моделирование',
    subtitle: 'История направления',
    slides: [
      { title: 'ТЗ и допуски', text: 'Фиксируем ограничения и монтажные зоны под реальные условия.' },
      { title: 'Параметрическая сборка', text: 'Строим модель, которую можно безопасно править и масштабировать.' },
      { title: 'Документация', text: 'Готовим STEP/STL и пакет для передачи в производство.' },
    ],
  },
  {
    id: 'reverse',
    title: 'Реверсивный инжиниринг',
    subtitle: 'История направления',
    slides: [
      { title: 'Из облака в поверхность', text: 'Очищаем mesh и собираем точную геометрию под CAD-редактирование.' },
      { title: 'Функциональные узлы', text: 'Восстанавливаем посадки, резьбы и монтажные базы.' },
      { title: 'Проверка перед выпуском', text: 'Сравниваем модель с оригиналом и подтверждаем отклонения.' },
    ],
  },
  {
    id: 'print',
    title: '3D-печать',
    subtitle: 'История направления',
    slides: [
      { title: 'Выбор технологии', text: 'Подбираем FDM/SLA/SLS под механику, бюджет и срок.' },
      { title: 'Печать и постобработка', text: 'Стабильное качество слоёв и аккуратная финишная обработка.' },
      { title: 'Контроль серии', text: 'Сверяем повторяемость между деталями и готовим отгрузку.' },
    ],
  },
  {
    id: 'prototype',
    title: 'Прототипирование',
    subtitle: 'История направления',
    slides: [
      { title: 'Быстрый макет', text: 'Первый рабочий образец для проверки габаритов и логики сборки.' },
      { title: 'Итерации', text: 'Корректируем форму и узлы до уверенного результата.' },
      { title: 'Переход в серию', text: 'Фиксируем финальный вариант и маршрут выпуска.' },
    ],
  },
  {
    id: 'engineering',
    title: 'Инженерное сопровождение',
    subtitle: 'История направления',
    slides: [
      { title: 'Маршрут проекта', text: 'Разбиваем задачу на этапы с контрольными точками.' },
      { title: 'Координация команд', text: 'Сводим скан, CAD и производство в единую коммуникацию.' },
      { title: 'Финальный пакет', text: 'Передаём результат в формате, готовом к внедрению.' },
    ],
  },
];

document.addEventListener('DOMContentLoaded', () => {
  const stories = Array.isArray(window.STEP3D_STORIES) ? window.STEP3D_STORIES : [];
  const storyList = document.getElementById('storyList');
  const storyStage = document.getElementById('storyStage');

  if (!storyList || !storyStage || !stories.length) return;

  let activeStoryId = stories[0].id;
  let activeSlideIndex = 0;

  const getStoryById = (storyId) => stories.find((story) => story.id === storyId) || stories[0];

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

  const setActiveStoryButton = () => {
    storyList.querySelectorAll('.story-card').forEach((button) => {
      const isActive = button.dataset.storyId === activeStoryId;
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

    const mediaHTML = slide.media?.type === 'video'
      ? `<video class="story-media" controls preload="metadata" src="${slide.media.src}"></video>`
      : `
      <div class="story-graphic" aria-hidden="true">
        <span class="story-graphic-ring"></span>
        <span class="story-graphic-core"></span>
        <span class="story-graphic-grid"></span>
      </div>
    `;

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
        <p class="eyebrow">Story Mode · Step3D</p>
        <h3>${story.title}</h3>
        <p>${story.subtitle}</p>
      </header>
      <div class="story-stage-main">
        <div class="story-stage-media">${mediaHTML}</div>
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

  stories.forEach((story) => storyList.appendChild(createStoryCard(story)));
  setActiveStoryButton();
  renderStoryStage();

  storyList.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
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
