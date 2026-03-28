import {
  ESTIMATE_BULLET_LIBRARY,
  ESTIMATE_COMPLEXITY_MAP,
  ESTIMATE_GOAL_TEXT,
  ESTIMATE_RHYTHM_MAP,
  ESTIMATE_ROUTE_MAP,
  ESTIMATE_TYPE_HEADLINES
} from '../../data/estimate.js';
import { validateEstimateState } from './data-guards.js';

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
  if (source === 'idea') bullets.push(ESTIMATE_BULLET_LIBRARY.sourceIdea);
  if (source === 'object') bullets.push(ESTIMATE_BULLET_LIBRARY.sourceObject);
  if (source === 'file') bullets.push(ESTIMATE_BULLET_LIBRARY.sourceFile);
  if (deadline === 'rush') bullets.push(ESTIMATE_BULLET_LIBRARY.rushDeadline);
  if (priority === 'quality') bullets.push(ESTIMATE_BULLET_LIBRARY.qualityPriority);
  if (priority === 'budget') bullets.push(ESTIMATE_BULLET_LIBRARY.budgetPriority);
  if (notes.length < 35) bullets.push(ESTIMATE_BULLET_LIBRARY.shortNotes);
  bullets.push(ESTIMATE_BULLET_LIBRARY.baseline);

  const state = {
    score,
    headline: ESTIMATE_TYPE_HEADLINES[type],
    description: `${ESTIMATE_GOAL_TEXT[goal]} Сейчас уровень готовности - ${score} из 100. Чем точнее вводные по сроку, применению и ограничениям, тем быстрее можно собрать маршрут работы.`,
    chips: {
      route: ESTIMATE_ROUTE_MAP[type],
      complexity: ESTIMATE_COMPLEXITY_MAP[scale],
      rhythm: ESTIMATE_RHYTHM_MAP[deadline]
    },
    bullets
  };

  validateEstimateState(state);
  return state;
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
