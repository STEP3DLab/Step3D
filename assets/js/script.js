// Бургер-меню
const burgerBtn = document.getElementById('burger-btn');
const navList = document.getElementById('nav-list');
if (burgerBtn && navList) {
  burgerBtn.addEventListener('click', () => {
    navList.classList.toggle('show');
    burgerBtn.classList.toggle('active');
  });
}

// Анимация появления при скролле
const appearElements = document.querySelectorAll('[data-appear]');
const options = { threshold: 0.2 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, options);
appearElements.forEach(el => observer.observe(el));

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

// Мульти-шаговая форма
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');

const next1 = document.getElementById('next1');
const prev1 = document.getElementById('prev1');
const next2 = document.getElementById('next2');
const prev2 = document.getElementById('prev2');
const submitForm = document.getElementById('submitForm');
const thankYouMessage = document.getElementById('thankYouMessage');

// Клики "Далее/Назад"
if (next1 && step1 && step2) {
  next1.addEventListener('click', () => {
    step1.classList.remove('active');
    step2.classList.add('active');
  });
}
if (prev1) {
  prev1.addEventListener('click', () => {
    step2.classList.remove('active');
    step1.classList.add('active');
  });
}
if (next2 && step2 && step3) {
  next2.addEventListener('click', () => {
    step2.classList.remove('active');
    step3.classList.add('active');
  });
}
if (prev2) {
  prev2.addEventListener('click', () => {
    step3.classList.remove('active');
    step2.classList.add('active');
  });
}

// При сабмите формы — показываем "спасибо"
if (submitForm && thankYouMessage) {
  submitForm.addEventListener('click', (e) => {
    // Если используем Formspree или другой сервис, 
    // можем дать форме отправиться через action="..."
    // Для демонстрации:
    setTimeout(() => {
      // Прячем форму, показываем thankYou
      document.getElementById('multiForm').style.display = 'none';
      thankYouMessage.style.display = 'block';
    }, 500);
  });
}

// 4. Отслеживание событий GA (упрощённый пример)
function gaEvent(label) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'click', {
      'event_category': 'UserActions',
      'event_label': label
    });
  } else {
    console.log('GA event:', label);
  }
}
window.gaEvent = gaEvent; // экспортируем в глобал

// 2. Калькулятор стоимости (program.html)
const calcBtn = document.getElementById('calc-btn');
const calcTotal = document.getElementById('calc-total');
if (calcBtn && calcTotal) {
  calcBtn.addEventListener('click', () => {
    const checks = document.querySelectorAll('#price-calc input[name="modules"]:checked');
    let sum = 0;
    checks.forEach(ch => {
      // Если выбрали "Полный курс (3 модуля)" (168000),
      // игнорируем остальные. Или наоборот. 
      sum += Number(ch.value);
    });
    // Пример применения студенческой скидки, если требуется
    // Реальный расчет скидки может быть сложнее.
    // Для демонстрации: -10% если "студент"
    // (можно добавить селектор "Я студент" или проч.)

    // Если выбрано 1 модуль = sum
    // 2 модуля = ~12% скидка (если выбрано?)
    // 3 модуля = 17% скидка (уже учтено в 168000)
    // Упростим: раз пользователь мог выбрать "полный курс", 
    // скидка уже заложена. Считаем только если выбрано 2 отдельные модуля?
    
    // Пример "2 отдельных модуля" => sum * 0.88
    if (checks.length === 2 && !Array.from(checks).some(ch => ch.value === '168000')) {
      sum = Math.round(sum * 0.88);
    }

    // Можно добавить ещё логику "студенческая скидка +10%", 
    // предполагая, что юзер указал "Я студент". Для демо жестко применим -10%
    // sum = Math.round(sum * 0.90);

    calcTotal.textContent = sum.toLocaleString('ru-RU');
  });
}
