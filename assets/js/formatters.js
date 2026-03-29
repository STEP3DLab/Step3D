(() => {
  const DEFAULT_LOCALE = 'ru';
  const LOCALES = ['ru', 'en'];

  const labels = {
    ru: {
      onRequest: 'По запросу',
      casesFound: (count) => `Найдено кейсов: ${count}`,
      noCasesTitle: 'Нет кейсов в этой категории',
      noCasesBody: 'Выберите другой фильтр или отправьте задачу — подберем релевантные примеры.',
      openCase: 'Открыть кейс →',
      modalTaskType: 'Тип задачи',
      modalSolution: 'Что сделали',
      modalResult: 'Результат',
      modalTimelineBudget: 'Срок / бюджет',
      timelineBudgetSeparator: ' · ',
      storySteps: (count) => `${count} этапов`,
      storyMode: 'Story Mode · Step3D',
      stageFrom: (index, total) => `Этап ${index} из ${total}`,
      previous: 'Назад',
      next: 'Дальше',
    },
    en: {
      onRequest: 'On request',
      casesFound: (count) => `Cases found: ${count}`,
      noCasesTitle: 'No cases in this category',
      noCasesBody: 'Choose another filter or send your task — we will share relevant examples.',
      openCase: 'Open case →',
      modalTaskType: 'Task type',
      modalSolution: 'What we did',
      modalResult: 'Result',
      modalTimelineBudget: 'Timeline / budget',
      timelineBudgetSeparator: ' · ',
      storySteps: (count) => `${count} steps`,
      storyMode: 'Story Mode · Step3D',
      stageFrom: (index, total) => `Step ${index} of ${total}`,
      previous: 'Previous',
      next: 'Next',
    },
  };

  const detectLocale = () => {
    const urlLocale = new URLSearchParams(window.location.search).get('lang');
    if (LOCALES.includes(urlLocale)) return urlLocale;
    const savedLocale = localStorage.getItem('step3d-locale');
    if (LOCALES.includes(savedLocale)) return savedLocale;
    const htmlLang = document.documentElement.lang?.toLowerCase();
    if (LOCALES.includes(htmlLang)) return htmlLang;
    return DEFAULT_LOCALE;
  };

  const setLocale = (locale) => {
    const next = LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
    localStorage.setItem('step3d-locale', next);
    document.documentElement.lang = next;
    return next;
  };

  const localize = (value, locale, fallback = '') => {
    if (typeof value === 'string') return value.trim() || fallback;
    if (value && typeof value === 'object') {
      const resolved = value[locale] || value[DEFAULT_LOCALE] || Object.values(value).find((item) => typeof item === 'string' && item.trim());
      return typeof resolved === 'string' ? resolved.trim() || fallback : fallback;
    }
    return fallback;
  };

  const getLabel = (locale, key, ...args) => {
    const entry = labels[locale]?.[key] ?? labels[DEFAULT_LOCALE][key];
    return typeof entry === 'function' ? entry(...args) : entry;
  };

  const textOrFallback = (value, locale) => {
    const fallback = getLabel(locale, 'onRequest');
    return localize(value, locale, fallback) || fallback;
  };

  const formatTimelineBudget = (timeline, budget, locale) => {
    return `${textOrFallback(timeline, locale)}${getLabel(locale, 'timelineBudgetSeparator')}${textOrFallback(budget, locale)}`;
  };

  window.STEP3D_FORMAT = {
    DEFAULT_LOCALE,
    LOCALES,
    detectLocale,
    setLocale,
    localize,
    labels,
    getLabel,
    textOrFallback,
    formatTimelineBudget,
  };

  window.setStep3DLocale = (locale) => {
    const nextLocale = setLocale(locale);
    window.dispatchEvent(new CustomEvent('step3d:locale-change', { detail: { locale: nextLocale } }));
  };
})();
