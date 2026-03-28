export const BRIEF_TEXT = {
  fallback: 'Не указано',
  greeting: (name) => `Здравствуйте. Меня зовут ${name}.`,
  contact: (contact) => `Контакт для связи: ${contact}.`,
  task: (task) => `Тип задачи: ${task}.`,
  deadline: (deadline) => `Желаемый срок: ${deadline}.`,
  assets: (assets) => `Что уже есть: ${assets}.`,
  descriptionTitle: 'Краткое описание задачи:',
  request: 'Прошу подсказать оптимальный маршрут работы и что еще подготовить для быстрого старта проекта.',
  copied: 'Скопировано',
  copyFailed: 'Не удалось скопировать',
  copyDefaultHtml: 'Скопировать <span class="arrow" aria-hidden="true"></span>',
  saved: 'Сохранено',
  saveDefault: 'Сохранить черновик',
  draftCleared: 'Черновик очищен. Заполните поля заново и нажмите «Собрать бриф».',
  descCounter: (length) => `${length} / 600`,
  completeness: (percent) => `Заполнено ${percent}%`
};
