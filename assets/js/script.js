// Бургер-меню
const burgerBtn = document.getElementById('burger-btn');
const navList = document.getElementById('nav-list');
if (burgerBtn && navList) {
  burgerBtn.addEventListener('click', () => {
    navList.classList.toggle('show');
    burgerBtn.classList.toggle('active');
  });
}

// Анимация появления (IntersectionObserver)
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

if (next1 && step1 && step2) {
  next1.addEventListener('click', () => {
    step1.classList.remove('active');
    step2.classList.add('active');
  });
}
if (prev1 && step1 && step2) {
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
if (prev2 && step2 && step3) {
  prev2.addEventListener('click', () => {
    step3.classList.remove('active');
    step2.classList.add('active');
  });
}
if (submitForm && thankYouMessage) {
  submitForm.addEventListener('click', (e) => {
    e.preventDefault();
    // Скрываем последний шаг формы
    step3.classList.remove('active');
    // Показываем "спасибо"
    thankYouMessage.style.display = 'block';
  });
}
