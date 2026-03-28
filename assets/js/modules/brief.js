export function buildBrief(data) {
  const name = data.name?.trim() || 'Не указано';
  const contact = data.contact?.trim() || 'Не указано';
  const task = data.task;
  const deadline = data.deadline;
  const assets = data.assets?.trim() || 'Не указано';
  const desc = data.description?.trim() || 'Не указано';

  return [
    `Здравствуйте. Меня зовут ${name}.`,
    `Контакт для связи: ${contact}.`,
    '',
    `Тип задачи: ${task}.`,
    `Желаемый срок: ${deadline}.`,
    `Что уже есть: ${assets}.`,
    '',
    'Краткое описание задачи:',
    `${desc}`,
    '',
    'Прошу подсказать оптимальный маршрут работы и что еще подготовить для быстрого старта проекта.'
  ].join('\n');
}

export function initBrief() {
  const briefOutput = document.getElementById('briefOutput');
  const generateBriefBtn = document.getElementById('generateBrief');
  const copyBriefBtn = document.getElementById('copyBrief');
  const saveDraftBtn = document.getElementById('saveBriefDraft');
  const clearDraftBtn = document.getElementById('clearBriefDraft');
  const descCounter = document.getElementById('briefDescCounter');
  const completeness = document.getElementById('briefCompleteness');
  const taskSelect = document.getElementById('briefTask');
  const deadlineSelect = document.getElementById('briefDeadline');
  const quickChips = [...document.querySelectorAll('.quick-chip')];
  if (!briefOutput || !generateBriefBtn || !copyBriefBtn || !taskSelect || !deadlineSelect) return;

  const fields = ['briefName', 'briefContact', 'briefTask', 'briefDeadline', 'briefAssets', 'briefDesc']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const DRAFT_KEY = 'step3d-brief-draft';

  const readData = () => ({
    name: document.getElementById('briefName').value,
    contact: document.getElementById('briefContact').value,
    task: document.getElementById('briefTask').value,
    deadline: document.getElementById('briefDeadline').value,
    assets: document.getElementById('briefAssets').value,
    description: document.getElementById('briefDesc').value
  });

  const syncMeta = () => {
    const desc = document.getElementById('briefDesc');
    const value = desc?.value ?? '';
    if (descCounter) descCounter.textContent = `${value.length} / 600`;
    if (completeness) {
      const filled = fields.filter((field) => field.value.trim().length > 0).length;
      completeness.textContent = `Заполнено ${Math.round((filled / fields.length) * 100)}%`;
    }
  };

  const saveDraft = () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(readData()));
  };

  const applyDraft = () => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw);
      document.getElementById('briefName').value = draft.name || '';
      document.getElementById('briefContact').value = draft.contact || '';
      document.getElementById('briefTask').value = draft.task || '3D-сканирование';
      document.getElementById('briefDeadline').value = draft.deadline || 'Стандартный';
      document.getElementById('briefAssets').value = draft.assets || '';
      document.getElementById('briefDesc').value = draft.description || '';
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
  };

  applyDraft();
  syncMeta();

  fields.forEach((field) => {
    field.addEventListener('input', () => {
      saveDraft();
      syncMeta();
    });
  });

  quickChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const nextTask = chip.dataset.briefTask;
      const nextDeadline = chip.dataset.briefDeadline;
      if (nextTask) taskSelect.value = nextTask;
      if (nextDeadline) deadlineSelect.value = nextDeadline;
      saveDraft();
      syncMeta();
    });
  });

  generateBriefBtn.addEventListener('click', () => {
    briefOutput.textContent = buildBrief(readData());
    saveDraft();
  });

  copyBriefBtn.addEventListener('click', async () => {
    const text = briefOutput.textContent.includes('Нажмите «Собрать бриф»') ? buildBrief(readData()) : briefOutput.textContent;
    try {
      await navigator.clipboard.writeText(text);
      copyBriefBtn.textContent = 'Скопировано';
    } catch {
      copyBriefBtn.textContent = 'Не удалось скопировать';
    }
    setTimeout(() => {
      copyBriefBtn.innerHTML = 'Скопировать <span class="arrow" aria-hidden="true"></span>';
    }, 1600);
  });

  saveDraftBtn?.addEventListener('click', () => {
    saveDraft();
    saveDraftBtn.textContent = 'Сохранено';
    setTimeout(() => {
      saveDraftBtn.textContent = 'Сохранить черновик';
    }, 1600);
  });

  clearDraftBtn?.addEventListener('click', () => {
    localStorage.removeItem(DRAFT_KEY);
    fields.forEach((field) => {
      if (field.tagName === 'SELECT') return;
      field.value = '';
    });
    taskSelect.value = '3D-сканирование';
    deadlineSelect.value = 'Стандартный';
    syncMeta();
    briefOutput.textContent = 'Черновик очищен. Заполните поля заново и нажмите «Собрать бриф».';
  });
}
