// Бургер-меню
const burgerBtn = document.getElementById('burger-btn');
const navList = document.getElementById('nav-list');
if (burgerBtn && navList) {
  burgerBtn.addEventListener('click', () => {
    navList.classList.toggle('show');
    burgerBtn.classList.toggle('active');
  });
}

// Scroll-to-Top (п.4)
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  // Показываем кнопку, если прокрутили > 400px
  if (window.scrollY > 400) {
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

// Анимация появления (data-appear)
const appearElements = document.querySelectorAll('[data-appear]');
const appearOptions = { threshold: 0.2 };
const appearObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, appearOptions);
appearElements.forEach(el => appearObserver.observe(el));

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

// (п.8) Подсчёт количества вопросов в FAQ
const faqSection = document.getElementById('faq');
if (faqSection) {
  const items = faqSection.querySelectorAll('.item');
  if (items.length > 0) {
    const titleEl = faqSection.querySelector('h2');
    titleEl.textContent += ` (${items.length})`;
  }
}

// (п.6) Поп-ап с оверлеем
const popupOverlay = document.getElementById('popup-overlay');
const showPopupBtn = document.getElementById('show-popup-btn');
const closePopupBtn = document.getElementById('close-popup-btn');

if (showPopupBtn && popupOverlay) {
  showPopupBtn.addEventListener('click', () => {
    popupOverlay.classList.add('show');
  });
}
if (closePopupBtn && popupOverlay) {
  closePopupBtn.addEventListener('click', () => {
    popupOverlay.classList.remove('show');
  });
}

// (п.2) Мульти-шаговая форма + прогресс-бар
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');
const next1 = document.getElementById('next1');
const prev1 = document.getElementById('prev1');
const next2 = document.getElementById('next2');
const prev2 = document.getElementById('prev2');
const submitForm = document.getElementById('submitForm');
const thankYouMessage = document.getElementById('thankYouMessage');
const formProgress = document.getElementById('form-progress');
const stepIndicators = document.querySelectorAll('.step-indicator');

if (next1 && step1 && step2) {
  next1.addEventListener('click', () => {
    step1.classList.remove('active');
    step2.classList.add('active');
    updateProgressBar(2);
  });
}
if (prev1 && step2 && step1) {
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
if (prev2 && step3 && step2) {
  prev2.addEventListener('click', () => {
    step3.classList.remove('active');
    step2.classList.add('active');
    updateProgressBar(2);
  });
}
if (submitForm && thankYouMessage) {
  submitForm.addEventListener('click', (e) => {
    e.preventDefault();
    // Скрыть форму, показать thank you
    document.getElementById('multiForm').style.display = 'none';
    thankYouMessage.style.display = 'block';
  });
}

function updateProgressBar(step) {
  if (!stepIndicators) return;
  stepIndicators.forEach(si => {
    si.classList.remove('active');
  });
  const current = document.querySelector(`.step-indicator[data-step="${step}"]`);
  if (current) current.classList.add('active');
}

// (п.3) Scrollspy — подсветка активного пункта в зависимости от скролла
const spyLinks = document.querySelectorAll('[data-spy]');
const sections = [];
spyLinks.forEach(link => {
  const sectionId = link.getAttribute('href').replace('#','');
  const sectionEl = document.getElementById(sectionId);
  if (sectionEl) {
    sections.push({ id: sectionId, el: sectionEl, link });
  }
});

window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 100; 
  sections.forEach(sec => {
    if (sec.el.offsetTop <= scrollPos && (sec.el.offsetTop + sec.el.offsetHeight) > scrollPos) {
      sec.link.classList.add('active-link');
    } else {
      sec.link.classList.remove('active-link');
    }
  });
});
