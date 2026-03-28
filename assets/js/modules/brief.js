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
  if (!briefOutput || !generateBriefBtn || !copyBriefBtn) return;

  const readData = () => ({
    name: document.getElementById('briefName').value,
    contact: document.getElementById('briefContact').value,
    task: document.getElementById('briefTask').value,
    deadline: document.getElementById('briefDeadline').value,
    assets: document.getElementById('briefAssets').value,
    description: document.getElementById('briefDesc').value
  });

  generateBriefBtn.addEventListener('click', () => {
    briefOutput.textContent = buildBrief(readData());
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
}
