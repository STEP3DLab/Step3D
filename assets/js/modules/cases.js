const caseData = {
  case1: {
    title: 'Реверсивный инжиниринг детали по физическому образцу',
    stats: [
      ['Формат входа', 'Образец или скан'],
      ['Фокус', 'Редактируемая модель'],
      ['Результат', 'CAD для работы']
    ],
    columns: [
      {
        title: 'Задача',
        items: [
          'есть физическая деталь, но нет исходной модели',
          'нужно восстановить геометрию и сохранить важные сопряжения',
          'результат должен подходить для дальнейших правок'
        ]
      },
      {
        title: 'Что делаем',
        items: [
          'получаем цифровую базу через сканирование или анализ образца',
          'собираем инженерную модель, а не просто сетку',
          'проверяем критичные размеры и готовим результат под следующий этап'
        ]
      },
      {
        title: 'Что получает клиент',
        items: ['редактируемую модель для дальнейшей работы', 'понятный маршрут правок и адаптаций', 'меньше риска потерять логику детали']
      }
    ],
    footer: 'Подходит, когда нужна не просто копия формы, а рабочая инженерная модель.'
  },
  case2: {
    title: 'Функциональный прототип для проверки формы и сборки',
    stats: [['Формат входа', 'Идея, эскиз или CAD'], ['Фокус', 'Быстрый тест'], ['Результат', 'Образец в руках']],
    columns: [
      { title: 'Задача', items: ['нужно быстро увидеть форму в реальности', 'важно проверить посадку, стыки или удобство', 'не хочется сразу идти в дорогой финальный цикл'] },
      { title: 'Что делаем', items: ['подбираем достаточную точность под цель проверки', 'изготавливаем прототип для быстрого теста', 'фиксируем, что менять на следующем этапе'] },
      { title: 'Что получает клиент', items: ['быстрое снижение неопределенности', 'материал для обсуждения и решений', 'экономию времени и бюджета на раннем этапе'] }
    ],
    footer: 'Подходит, когда нужно быстро проверить форму, сборку или эргономику.'
  },
  case3: {
    title: 'Награда, арт-объект или выставочный предмет',
    stats: [['Формат входа', 'Эскиз и референсы'], ['Фокус', 'Подача и качество'], ['Результат', 'Объект презентационного уровня']],
    columns: [
      { title: 'Задача', items: ['нужен выразительный предмет, а не просто печать', 'важны и внешний вид, и технологичность', 'нужно учесть сборку, поверхность и подачу'] },
      { title: 'Что делаем', items: ['соединяем дизайн и производственную логику', 'подбираем материал и постобработку', 'готовим объект под реальное использование или экспозицию'] },
      { title: 'Что получает клиент', items: ['предмет, который хорошо выглядит вживую', 'меньше риска конфликтов между идеей и производством', 'более сильную финальную подачу'] }
    ],
    footer: 'Подходит для наград, арт-объектов и выставочных предметов.'
  }
};

export function initCases() {
  const caseItems = document.querySelectorAll('.case-item');
  const caseTitle = document.getElementById('caseTitle');
  const caseStats = document.getElementById('caseStats');
  const caseBody = document.getElementById('caseBody');
  const caseFooterText = document.getElementById('caseFooterText');
  if (!caseItems.length || !caseTitle || !caseStats || !caseBody || !caseFooterText) return;

  const renderCase = (id) => {
    const data = caseData[id];
    if (!data) return;
    caseTitle.textContent = data.title;
    caseFooterText.textContent = data.footer;
    caseStats.innerHTML = data.stats.map(([label, value]) => `<div class="case-stat"><strong>${label}</strong><span>${value}</span></div>`).join('');
    caseBody.innerHTML = data.columns
      .map((col) => `<div class="case-column"><strong>${col.title}</strong><ul>${col.items.map((item) => `<li>${item}</li>`).join('')}</ul></div>`)
      .join('');
  };

  caseItems.forEach((item) => {
    item.addEventListener('click', () => {
      caseItems.forEach((btn) => btn.classList.remove('is-active'));
      item.classList.add('is-active');
      renderCase(item.dataset.case);
    });
  });

  renderCase('case1');
}
