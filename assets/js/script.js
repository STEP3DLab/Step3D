// Бургер-меню
const burgerBtn = document.getElementById('burger-btn');
const navList = document.getElementById('nav-list');
if (burgerBtn && navList) {
  burgerBtn.addEventListener('click', () => {
    navList.classList.toggle('show');
  });
}

// Кнопка "Наверх"
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add('showBtn');
  } else {
    scrollTopBtn.classList.remove('showBtn');
  }
});
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// FAQ-аккордеон
const faqButtons = document.querySelectorAll('.question');
faqButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    if (answer.style.maxHeight) {
      answer.style.maxHeight = null;
    } else {
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// Floating action bar
const fab = document.getElementById('fab');
const fabToggle = document.getElementById('fab-toggle');
if (fabToggle && fab) {
  fabToggle.addEventListener('click', () => {
    fab.classList.toggle('show');
  });
}

// Countdown (п.8)
const countdownTimerEl = document.getElementById('countdown-timer');
if (countdownTimerEl) {
  const targetDate = new Date('2025-05-19T10:00:00'); // пример
  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;
    if (diff <= 0) {
      countdownTimerEl.textContent = 'Курс уже начался!';
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    countdownTimerEl.textContent = `${days} дн ${hours} ч ${mins} мин ${secs} с`;
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// Прогресс чтения (п.5)
const readingProgressBar = document.getElementById('readingProgressBar');
const contentArea = document.getElementById('content-area');
if (readingProgressBar && contentArea) {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = contentArea.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    readingProgressBar.style.width = progress + '%';
  });
}

// "Отложить заявку" (p.6)
const saveForLaterBtn = document.getElementById('saveForLaterBtn');
if (saveForLaterBtn) {
  saveForLaterBtn.addEventListener('click', () => {
    const nameVal = document.getElementById('name').value;
    const phoneVal = document.getElementById('phone').value;
    const data = { name: nameVal, phone: phoneVal, timestamp: Date.now() };
    localStorage.setItem('savedApplication', JSON.stringify(data));
    alert('Заявка отложена! Вы сможете вернуться к заполнению позже.');
  });
}

// Если в localStorage есть сохранённая заявка, восстанавливаем
const multiForm = document.getElementById('multiForm');
if (multiForm) {
  const saved = localStorage.getItem('savedApplication');
  if (saved) {
    const savedObj = JSON.parse(saved);
    if (savedObj.name) document.getElementById('name').value = savedObj.name;
    if (savedObj.phone) document.getElementById('phone').value = savedObj.phone;
  }
}

// Многошаговая форма + inline validation
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');
const next1 = document.getElementById('next1');
const next2 = document.getElementById('next2');
const prev1 = document.getElementById('prev1');
const prev2 = document.getElementById('prev2');
const submitForm = document.getElementById('submitForm');
const thankYouMessage = document.getElementById('thankYouMessage');
const stepIndicators = document.querySelectorAll('.step-indicator');

function updateProgressBar(step) {
  stepIndicators.forEach(si => si.classList.remove('active'));
  const current = document.querySelector(`.step-indicator[data-step="${step}"]`);
  if (current) current.classList.add('active');
}

function validateStep1() {
  const nameVal = (document.getElementById('name')?.value || '').trim();
  const phoneVal = (document.getElementById('phone')?.value || '').trim();
  if (!nameVal || !phoneVal) {
    alert('Пожалуйста, заполните имя и телефон.');
    return false;
  }
  return true;
}

if (next1 && step1 && step2) {
  next1.addEventListener('click', () => {
    if (!validateStep1()) return;
    step1.classList.remove('active');
    step2.classList.add('active');
    updateProgressBar(2);
  });
}
if (prev1 && step1 && step2) {
  prev1.addEventListener('click', () => {
    step2.classList.remove('active');
    step1.classList.add('active');
    updateProgressBar(1);
  });
}
if (next2 && step2 && step3) {
  next2.addEventListener('click', () => {
    // Доп. валидация шаг 2 (опционально)
    step2.classList.remove('active');
    step3.classList.add('active');
    updateProgressBar(3);
  });
}
if (prev2 && step2 && step3) {
  prev2.addEventListener('click', () => {
    step3.classList.remove('active');
    step2.classList.add('active');
    updateProgressBar(2);
  });
}
if (submitForm && thankYouMessage && multiForm) {
  submitForm.addEventListener('click', (e) => {
    e.preventDefault();
    const emailVal = (document.getElementById('email')?.value || '').trim();
    if (!emailVal) {
      alert('Пожалуйста, введите e-mail!');
      return;
    }
    // Скрыть форму, показать "спасибо"
    multiForm.style.display = 'none';
    thankYouMessage.style.display = 'block';
    // Очистить localStorage, чтобы заявка не восстанавливалась повторно
    localStorage.removeItem('savedApplication');
  });
}

// (13) Поиск по сайту (autocomplete)
const siteSearch = document.getElementById('site-search');
const autocompleteList = document.getElementById('autocomplete-list');
const siteData = [
  '3D-сканирование',
  'CAD-моделирование',
  'Реверсивный инжиниринг',
  'Финальный проект',
  'WorldSkills',
  'Прототипирование',
  'Аддитивные технологии',
  'Базовый модуль',
  'Углублённый модуль',
  'Компетенции',
  'Чемпионат',
  'Лаборатория'
];
if (siteSearch && autocompleteList) {
  siteSearch.addEventListener('input', () => {
    const query = siteSearch.value.toLowerCase();
    if (!query) {
      autocompleteList.style.display = 'none';
      return;
    }
    const results = siteData.filter(item => 
      item.toLowerCase().includes(query)
    );
    autocompleteList.innerHTML = results.map(r => `<li>${r}</li>`).join('');
    autocompleteList.style.display = results.length ? 'block' : 'none';
  });
  autocompleteList.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
      siteSearch.value = e.target.textContent;
      autocompleteList.style.display = 'none';
    }
  });
}

/* (14) Sticky subheadings — уже реализовано через CSS: .sticky-heading > h2 {
   position: sticky; top: ... } 
   JS не обязателен для этого, 
   но можно добавить логику, если нужно более гибко. */
