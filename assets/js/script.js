// Header: добавление тени при скролле
const mainHeader = document.getElementById('main-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    mainHeader.classList.add('scrolled');
  } else {
    mainHeader.classList.remove('scrolled');
  }
});

// Burger-menu
const burgerBtn = document.getElementById('burger-btn');
const navList = document.getElementById('nav-list');
if (burgerBtn && navList) {
  burgerBtn.addEventListener('click', () => {
    navList.classList.toggle('show');
  });
}

// Scroll-to-Top
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

// Fade-in эффекты через IntersectionObserver
const fadeEls = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
fadeEls.forEach(el => fadeObserver.observe(el));

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

// Countdown
const countdownTimerEl = document.getElementById('countdown-timer');
if (countdownTimerEl) {
  const targetDate = new Date('2025-05-19T10:00:00');
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

// Прогресс чтения (если используется)
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

// Floating action bar
const fab = document.getElementById('fab');
const fabToggle = document.getElementById('fab-toggle');
if (fabToggle && fab) {
  fabToggle.addEventListener('click', () => {
    fab.classList.toggle('show');
  });
}

// "Отложить заявку" — сохранение данных в localStorage
const saveForLaterBtn = document.getElementById('saveForLaterBtn');
if (saveForLaterBtn) {
  saveForLaterBtn.addEventListener('click', () => {
    const nameVal = document.getElementById('name').value;
    const phoneVal = document.getElementById('phone').value;
    const data = { name: nameVal, phone: phoneVal, timestamp: Date.now() };
    localStorage.setItem('savedApplication', JSON.stringify(data));
    alert('Заявка отложена! Вы сможете вернуться позже.');
  });
}

// Если в localStorage есть сохранённая заявка, восстанавливаем данные формы
const multiForm = document.getElementById('multiForm');
if (multiForm) {
  const saved = localStorage.getItem('savedApplication');
  if (saved) {
    const savedObj = JSON.parse(saved);
    if (savedObj.name) document.getElementById('name').value = savedObj.name;
    if (savedObj.phone) document.getElementById('phone').value = savedObj.phone;
  }
}

// Многошаговая форма и progress bar
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
    // Скрыть форму, показать "Спасибо" и очистить сохранение
    multiForm.style.display = 'none';
    thankYouMessage.style.display = 'block';
    localStorage.removeItem('savedApplication');
  });
}
