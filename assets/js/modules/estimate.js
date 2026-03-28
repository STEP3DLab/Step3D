const complexityMap = { small: 'Низкая', medium: 'Средняя', large: 'Повышенная' };
const routeMap = {
  scan: 'Сканирование → цифровая база',
  reverse: 'Сканирование / анализ → CAD',
  prototype: 'Подготовка → прототип → правки',
  print: 'Подготовка → печать → финиш',
  mixed: 'Комбинированный маршрут'
};
const rhythmMap = { rush: 'Срочный', normal: 'Стандартный', planned: 'Плановый' };
const typeHeadlines = {
  scan: 'Хороший старт для сканирования объекта.',
  reverse: 'Сценарий подходит для старта реверсивного инжиниринга.',
  prototype: 'Сценарий подходит для быстрого запуска прототипа.',
  print: 'Сценарий подходит для подготовки к изготовлению.',
  mixed: 'Комплексная задача требует чуть больше вводных, но логика уже собрана.'
};
const goalText = {
  demo: 'Фокус на подаче и внешнем виде.',
  test: 'Фокус на проверке формы, посадки или механики.',
  restore: 'Фокус на восстановлении или повторении геометрии.',
  adapt: 'Фокус на инженерной доработке.',
  production: 'Фокус на результате для следующего производственного шага.'
};

export function calculateEstimateState(input) {
  const { type, goal, source, scale, notes, priority, deadline } = input;
  let score = 58;

  if (source === 'object' || source === 'file') score += 8;
  if (goal === 'production' || goal === 'adapt' || goal === 'restore') score += 6;
  if (notes.length > 35) score += 6;
  if (notes.length > 110) score += 4;
  if (scale === 'small') score += 3;
  if (scale === 'large') score -= 4;
  if (deadline === 'rush') score -= 6;
  if (priority === 'quality') score += 3;
  if (type === 'mixed') score -= 2;
  score = Math.max(42, Math.min(92, score));

  const bullets = [];
  if (source === 'idea') bullets.push('Добавить 2-4 референса или похожих фото.');
  if (source === 'object') bullets.push('Сфотографировать объект с нескольких сторон и указать габариты.');
  if (source === 'file') bullets.push('Подготовить файл и коротко описать цель результата.');
  if (deadline === 'rush') bullets.push('Сразу отметить крайний срок и что обязательно успеть.');
  if (priority === 'quality') bullets.push('Уточнить, где критична точность: размеры, посадки или внешний вид.');
  if (priority === 'budget') bullets.push('Сразу обозначить желаемый бюджет и допустимый компромисс.');
  if (notes.length < 35) bullets.push('Добавить одно-два предложения о том, как будет использоваться результат.');
  bullets.push('Собрать бриф ниже, чтобы не потерять важные детали.');

  return {
    score,
    headline: typeHeadlines[type],
    description: `${goalText[goal]} Сейчас уровень готовности - ${score} из 100. Чем точнее вводные по сроку, применению и ограничениям, тем быстрее можно собрать маршрут работы.`,
    chips: {
      route: routeMap[type],
      complexity: complexityMap[scale],
      rhythm: rhythmMap[deadline]
    },
    bullets
  };
}

function activeOptionValue(groupName) {
  const active = document.querySelector(`.option[data-group="${groupName}"].is-active`);
  return active ? active.dataset.value : '';
}

export function initEstimate() {
  const estimateForm = document.getElementById('estimateForm');
  const scoreRing = document.getElementById('scoreRing');
  const scoreValue = document.getElementById('scoreValue');
  const estimateHeadline = document.getElementById('estimateHeadline');
  const estimateText = document.getElementById('estimateText');
  const estimateChips = document.getElementById('estimateChips');
  const estimateBullets = document.getElementById('estimateBullets');
  const estimateLiveStatus = document.getElementById('estimateLiveStatus');
  if (!estimateForm || !scoreRing || !scoreValue || !estimateHeadline || !estimateText || !estimateChips || !estimateBullets) {
    return { updateEstimate: () => {} };
  }

  const optionGroups = {};
  const setActiveOption = (group, activeButton) => {
    optionGroups[group].forEach((el) => {
      const isActive = el === activeButton;
      el.classList.toggle('is-active', isActive);
      el.setAttribute('aria-checked', String(isActive));
      el.tabIndex = isActive ? 0 : -1;
    });
  };

  document.querySelectorAll('.option').forEach((btn) => {
    const group = btn.dataset.group;
    if (!optionGroups[group]) optionGroups[group] = [];
    optionGroups[group].push(btn);

    btn.addEventListener('click', () => {
      setActiveOption(group, btn);
      updateEstimate({ announce: true });
    });

    btn.addEventListener('keydown', (event) => {
      const groupButtons = optionGroups[group];
      const index = groupButtons.indexOf(btn);

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        const next = groupButtons[(index + 1) % groupButtons.length];
        setActiveOption(group, next);
        next.focus();
        updateEstimate({ announce: true });
      }

      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        const next = groupButtons[(index - 1 + groupButtons.length) % groupButtons.length];
        setActiveOption(group, next);
        next.focus();
        updateEstimate({ announce: true });
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setActiveOption(group, btn);
        updateEstimate({ announce: true });
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        btn.blur();
      }
    });
  });

  Object.entries(optionGroups).forEach(([group, buttons]) => {
    const active = buttons.find((btn) => btn.classList.contains('is-active')) || buttons[0];
    if (active) setActiveOption(group, active);
  });

  let lastAnnouncement = '';

  function updateEstimate({ announce = false } = {}) {
    const state = calculateEstimateState({
      type: document.getElementById('projectType').value,
      goal: document.getElementById('projectGoal').value,
      source: document.getElementById('projectSource').value,
      scale: document.getElementById('projectScale').value,
      notes: document.getElementById('projectNotes').value.trim(),
      priority: activeOptionValue('priority'),
      deadline: activeOptionValue('deadline')
    });

    scoreRing.style.setProperty('--progress', state.score);
    scoreValue.textContent = state.score;
    estimateHeadline.textContent = state.headline;
    estimateText.textContent = state.description;
    estimateChips.innerHTML = `<span class="pill"><strong>Маршрут</strong> ${state.chips.route}</span><span class="pill"><strong>Сложность</strong> ${state.chips.complexity}</span><span class="pill"><strong>Ритм</strong> ${state.chips.rhythm}</span>`;
    estimateBullets.innerHTML = state.bullets.map((item) => `<li>${item}</li>`).join('');

    if (estimateLiveStatus && announce) {
      const announcement = `Оценка обновлена: ${state.score} из 100. ${state.headline}`;
      if (announcement !== lastAnnouncement) {
        estimateLiveStatus.textContent = announcement;
        lastAnnouncement = announcement;
      }
    }
  }

  estimateForm.addEventListener('input', (event) => {
    const shouldAnnounce = event.target.id !== 'projectNotes';
    updateEstimate({ announce: shouldAnnounce });
  });
  estimateForm.addEventListener('change', () => updateEstimate({ announce: true }));
  updateEstimate();

  return { updateEstimate: () => updateEstimate({ announce: true }) };
}
