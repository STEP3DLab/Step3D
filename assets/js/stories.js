document.addEventListener('DOMContentLoaded', async () => {
  const formatLayer = window.STEP3D_FORMAT;
  const locale = formatLayer?.detectLocale?.() || 'ru';

  const FALLBACK_STORIES = [
    {
      id: 'pipeline',
      type: 'story',
      title: { ru: 'Pipeline: от входных данных до готового изделия', en: 'Pipeline: from input data to ready product' },
      subtitle: { ru: 'Интерактивный маршрут Step3D', en: 'Interactive Step3D workflow' },
      problem: { ru: 'Разрозненные подрядчики и отсутствие единого маршрута увеличивают риски проекта.', en: 'Fragmented vendors increase project risks.' },
      solution: { ru: 'Единый инженерный пайплайн от входа до передачи.', en: 'Unified engineering pipeline from intake to delivery.' },
      result: { ru: 'Предсказуемый маршрут и прозрачные этапы.', en: 'Predictable flow and transparent milestones.' },
      slides: [
        { title: { ru: 'Scan / Input', en: 'Scan / Input' }, text: { ru: 'Собираем исходные данные.', en: 'Collect source data.' } },
        { title: { ru: 'CAD / Reverse', en: 'CAD / Reverse' }, text: { ru: 'Готовим редактируемую модель.', en: 'Build an editable model.' } },
      ],
    },
  ];

  const isLocalizedValue = (value) => typeof value === 'string' || (value && typeof value === 'object');
  const isValidSlide = (slide) => {
    if (!slide || typeof slide !== 'object') return false;
    return isLocalizedValue(slide.title) && isLocalizedValue(slide.text);
  };

  const isValidStory = (item) => {
    if (!item || typeof item !== 'object') return false;
    if (typeof item.id !== 'string' || !item.id.trim()) return false;
    if (typeof item.type !== 'string' || !item.type.trim()) return false;
    if (!['title', 'problem', 'solution', 'result'].every((key) => isLocalizedValue(item[key]))) return false;
    if (!Array.isArray(item.slides) || !item.slides.length || !item.slides.every(isValidSlide)) return false;
    return true;
  };

  const loadStories = async () => {
    try {
      const response = await fetch('assets/data/stories.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      const items = Array.isArray(payload?.items) ? payload.items.filter(isValidStory) : [];
      if (items.length) return items;
      throw new Error('Schema validation failed for stories.json');
    } catch (error) {
      console.warn('[Step3D] Using fallback stories data:', error);
      return FALLBACK_STORIES.filter(isValidStory);
    }
  };

  const stories = await loadStories();
  const storyList = document.getElementById('storyList');
  const storyStage = document.getElementById('storyStage');

  if (!storyList || !storyStage || !stories.length) return;

  let activeStoryId = stories[0].id;
  let activeSlideIndex = 0;

  const localize = (value) => formatLayer?.localize?.(value, locale, '') || '';
  const textOrFallback = (value) => formatLayer?.textOrFallback?.(value, locale) || '';

  const getStoryById = (storyId) => stories.find((story) => story.id === storyId) || stories[0];

  const createStoryCard = (story) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'story-card';
    button.dataset.storyId = story.id;

    const title = document.createElement('span');
    title.className = 'story-card-title';
    title.textContent = textOrFallback(story.title);

    const subtitle = document.createElement('span');
    subtitle.className = 'story-card-subtitle';
    subtitle.textContent = textOrFallback(story.subtitle);

    const count = document.createElement('span');
    count.className = 'story-card-count';
    count.textContent = formatLayer?.getLabel?.(locale, 'storySteps', story.slides.length) || `${story.slides.length}`;

    button.append(title, subtitle, count);
    return button;
  };

  const setActiveStoryButton = () => {
    storyList.querySelectorAll('.story-card').forEach((button) => {
      const isActive = button.dataset.storyId === activeStoryId;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  };

  const createGraphic = () => {
    const graphic = document.createElement('div');
    graphic.className = 'story-graphic';
    graphic.setAttribute('aria-hidden', 'true');

    const ring = document.createElement('span');
    ring.className = 'story-graphic-ring';
    const core = document.createElement('span');
    core.className = 'story-graphic-core';
    const grid = document.createElement('span');
    grid.className = 'story-graphic-grid';

    graphic.append(ring, core, grid);
    return graphic;
  };

  const renderStoryStage = () => {
    const story = getStoryById(activeStoryId);
    const slides = story.slides || [];
    const safeIndex = Math.min(activeSlideIndex, Math.max(slides.length - 1, 0));
    const slide = slides[safeIndex];
    if (!slide) return;

    storyStage.textContent = '';

    const header = document.createElement('header');
    header.className = 'story-stage-head';

    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = formatLayer?.getLabel?.(locale, 'storyMode') || 'Story Mode · Step3D';

    const title = document.createElement('h3');
    title.textContent = textOrFallback(story.title);

    const subtitle = document.createElement('p');
    subtitle.textContent = textOrFallback(story.subtitle);

    header.append(eyebrow, title, subtitle);

    const main = document.createElement('div');
    main.className = 'story-stage-main';

    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'story-stage-media';

    if (slide.media?.type === 'video' && typeof slide.media.src === 'string') {
      const video = document.createElement('video');
      video.className = 'story-media';
      video.controls = true;
      video.preload = 'metadata';
      video.src = slide.media.src;
      mediaWrap.appendChild(video);
    } else {
      mediaWrap.appendChild(createGraphic());
    }

    const content = document.createElement('div');
    content.className = 'story-stage-content';

    const slideIndex = document.createElement('p');
    slideIndex.className = 'story-slide-index';
    slideIndex.textContent = formatLayer?.getLabel?.(locale, 'stageFrom', safeIndex + 1, slides.length) || `${safeIndex + 1}/${slides.length}`;

    const slideTitle = document.createElement('h4');
    slideTitle.textContent = textOrFallback(slide.title);

    const slideText = document.createElement('p');
    slideText.textContent = textOrFallback(slide.text);

    const controls = document.createElement('div');
    controls.className = 'story-controls';

    const prevButton = document.createElement('button');
    prevButton.type = 'button';
    prevButton.className = 'btn btn-secondary story-prev';
    prevButton.disabled = safeIndex === 0;
    prevButton.textContent = formatLayer?.getLabel?.(locale, 'previous') || 'Назад';

    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.className = 'btn btn-primary story-next';
    nextButton.disabled = safeIndex === slides.length - 1;
    nextButton.textContent = formatLayer?.getLabel?.(locale, 'next') || 'Дальше';

    controls.append(prevButton, nextButton);
    content.append(slideIndex, slideTitle, slideText, controls);
    main.append(mediaWrap, content);

    const timeline = document.createElement('div');
    timeline.className = 'story-timeline';

    slides.forEach((item, index) => {
      const stepButton = document.createElement('button');
      stepButton.type = 'button';
      stepButton.className = `story-step ${index === safeIndex ? 'is-current' : ''}`;
      stepButton.dataset.stepIndex = String(index);

      const stepNum = document.createElement('span');
      stepNum.textContent = String(index + 1).padStart(2, '0');

      const stepTitle = document.createElement('strong');
      stepTitle.textContent = localize(item.title);

      stepButton.append(stepNum, stepTitle);
      timeline.appendChild(stepButton);
    });

    storyStage.append(header, main, timeline);
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
