const qs = (s, root = document) => root.querySelector(s);
const qsa = (s, root = document) => [...root.querySelectorAll(s)];

const toastEl = qs('#toast');
const notify = (message) => {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => toastEl.classList.remove('show'), 2200);
};

const menuToggle = qs('#menuToggle');
const mainNav = qs('#mainNav');
menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
qsa('#mainNav a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const progressBar = qs('#scrollProgressBar');
const sections = qsa('main .section');
const railLinks = qsa('.section-rail a');

const onScroll = () => {
  const scrolled = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${Math.max(0, Math.min(100, (scrolled / max) * 100))}%`;

  let currentId = 'hero';
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 160) currentId = section.id;
  });
  railLinks.forEach((link) => link.classList.toggle('active', link.dataset.rail === currentId));
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const initCardFilter = ({ groupSelector, cardSelector, key }) => {
  const buttons = qsa(groupSelector + ' .filter');
  const cards = qsa(cardSelector);
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const value = btn.dataset[key];
      cards.forEach((card) => {
        const matched = value === 'all' || card.dataset[key] === value;
        card.hidden = !matched;
      });
    });
  });
};

initCardFilter({ groupSelector: '#serviceFilters', cardSelector: '.service-card', key: 'filter' });
initCardFilter({ groupSelector: '#caseFilters', cardSelector: '.case-card', key: 'case' });

const estimateForm = qs('#estimateForm');
const estimateResult = qs('#estimateResult');
const basePrice = { scan: 12000, reverse: 28000, print: 9000, full: 45000 };
estimateForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const type = qs('#estimateType').value;
  const urgency = qs('#estimateUrgency').value;
  const qty = Math.max(1, Number(qs('#estimateQty').value || 1));

  const urgencyFactor = urgency === 'urgent' ? 1.35 : 1;
  const min = Math.round(basePrice[type] * qty * urgencyFactor);
  const max = Math.round(min * 1.35);
  estimateResult.textContent = `Ориентир: ${min.toLocaleString('ru-RU')} — ${max.toLocaleString('ru-RU')} ₽`;
  notify('Оценка рассчитана. Можно отправлять заявку.');
});

const modal = qs('#caseModal');
const modalTitle = qs('#caseModalTitle');
const modalText = qs('#caseModalText');
const caseDetails = {
  case1: {
    title: 'Импортозамещение кронштейна линии',
    text: 'Срок проекта — 9 рабочих дней. Результат: рабочая CAD-модель, комплект для изготовления и пилотная партия без остановки линии.'
  },
  case2: {
    title: 'Корпус датчика для спецтехники',
    text: 'Срок проекта — 7 рабочих дней. Результат: усиленная конструкция, 3 итерации прототипов, подтверждение посадки на стенде заказчика.'
  },
  case3: {
    title: 'Прототип узла для НИОКР',
    text: 'Срок проекта — 5 рабочих дней. Результат: функциональный прототип для внутренней валидации и рекомендации для перехода к мелкой серии.'
  }
};

qsa('[data-modal]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.modal;
    modalTitle.textContent = caseDetails[key].title;
    modalText.textContent = caseDetails[key].text;
    modal.showModal();
  });
});
qs('#closeCaseModal')?.addEventListener('click', () => modal.close());
modal?.addEventListener('click', (e) => {
  const rect = modal.getBoundingClientRect();
  const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
  if (!inside) modal.close();
});

const leadForm = qs('#lead-form');
leadForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  leadForm.reset();
  notify('Спасибо! Заявка принята. Мы свяжемся с вами в рабочее время.');
});

qsa('#faq details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    qsa('#faq details').forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});
