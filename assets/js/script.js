// Header: Добавление тени при скролле
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

// Fade-in: Активируем эффекты при прокрутке для элементов с классом .fade-in
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

// Прогресс чтения (для program.html, если используется, здесь мы пример общий)
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

/* Дополнительно можно добавить обработку для восстановления состояния "Отложенной заявки" в multiForm,
   если используется в другой странице (contacts.html) */
// (Если используется форма с сохранением данных, логика уже описана в contacts.html)
