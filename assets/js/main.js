document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const progress = document.getElementById('scrollProgress');
  const navLinks = [...document.querySelectorAll('.nav a')];
  const sections = [...document.querySelectorAll('main section[id]')];

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const onScroll = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) {
      progress.style.width = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
    }

    let activeId = '';
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= 140) activeId = section.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${activeId}`);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.querySelectorAll('.faq-item').forEach((item) => {
    const button = item.querySelector('.faq-btn');
    button?.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');
      document.querySelectorAll('.faq-item').forEach((el) => {
        el.classList.remove('is-open');
        el.querySelector('.faq-btn')?.setAttribute('aria-expanded', 'false');
      });

      if (willOpen) {
        item.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const caseGrid = document.getElementById('caseGrid');
  const caseModal = document.getElementById('caseModal');
  const caseModalContent = document.getElementById('caseModalContent');
  const caseModalClose = document.getElementById('caseModalClose');
  const storyModal = document.getElementById('storyModal');
  const storyModalContent = document.getElementById('storyModalContent');
  const storyModalClose = document.getElementById('storyModalClose');
  const cases = window.STEP3D_CASES || [];

  const renderCaseCard = (item) => {
    const card = document.createElement('article');
    card.className = 'case-card';
    card.innerHTML = `
      <div class="case-top">
        <p class="case-type">${item.categoryLabel}</p>
        <p class="case-meta">${item.timeline}</p>
      </div>
      <h3>${item.title}</h3>
      <p>${item.problem}</p>
      <p class="case-meta">Формат: ${item.output}</p>
      <button class="case-link" data-case-id="${item.id}" type="button">Открыть кейс →</button>
    `;
    return card;
  };

  const renderCases = (filter = 'all') => {
    if (!caseGrid) return;

    const filtered = cases.filter((item) => filter === 'all' || item.type.includes(filter));
    caseGrid.innerHTML = '';

    if (!filtered.length) {
      caseGrid.innerHTML = '<article class="card"><h3>Кейсы в этой категории добавляются</h3><p>Выберите другой фильтр или свяжитесь с нами — покажем релевантные примеры под вашу задачу.</p></article>';
      return;
    }

    filtered.forEach((item) => caseGrid.appendChild(renderCaseCard(item)));
  };

  const openCaseModal = (caseId) => {
    const selected = cases.find((item) => item.id === caseId);
    if (!selected || !caseModal || !caseModalContent) return;

    caseModalContent.innerHTML = `
      <p class="case-type">${selected.categoryLabel}</p>
      <h3 class="modal-title">${selected.title}</h3>
      <p>${selected.problem}</p>
      <div class="modal-grid">
        <div><strong>Тип задачи</strong><p>${selected.taskType}</p></div>
        <div><strong>Что сделали</strong><p>${selected.solution}</p></div>
        <div><strong>Результат</strong><p>${selected.result}</p></div>
        <div><strong>Срок / бюджет</strong><p>${selected.timeline} · ${selected.budget}</p></div>
      </div>
      <p class="modal-format"><strong>Формат результата:</strong> ${selected.output}</p>
    `;

    caseModal.showModal();
  };

  document.querySelectorAll('.filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter || 'all';
      document.querySelectorAll('.filter-btn').forEach((item) => {
        item.classList.remove('is-active');
        item.setAttribute('aria-selected', 'false');
      });
      button.classList.add('is-active');
      button.setAttribute('aria-selected', 'true');
      renderCases(filter);
    });
  });

  caseGrid?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.matches('.case-link')) {
      openCaseModal(target.dataset.caseId);
    }
  });

  caseModalClose?.addEventListener('click', () => caseModal?.close());
  caseModal?.addEventListener('click', (event) => {
    if (event.target === caseModal) caseModal.close();
  });

  renderCases();

  const openStoryModal = (title, text) => {
    if (!storyModal || !storyModalContent) return;
    const paragraphs = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `<p>${line}</p>`)
      .join('');

    storyModalContent.innerHTML = `
      <p class="case-type">Формат взаимодействия</p>
      <h3 class="modal-title">${title}</h3>
      <div class="modal-grid story-modal-grid">${paragraphs}</div>
    `;

    storyModal.showModal();
  };

  document.querySelectorAll('.story-card').forEach((card) => {
    const title = card.getAttribute('data-story-title') || 'Детали';
    const text = card.getAttribute('data-story-text') || '';

    card.addEventListener('click', () => openStoryModal(title, text));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openStoryModal(title, text);
      }
    });
  });

  storyModalClose?.addEventListener('click', () => storyModal?.close());
  storyModal?.addEventListener('click', (event) => {
    if (event.target === storyModal) storyModal.close();
  });

  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const attachedFiles = formData.getAll('attachments')
      .filter((file) => file && typeof file === 'object' && 'name' in file && file.name)
      .map((file) => file.name);
    const message = [
      'Новая заявка Step3D',
      `Имя: ${formData.get('name')}`,
      `Компания/роль: ${formData.get('company') || '—'}`,
      `Контакт: ${formData.get('contact')}`,
      `Тип задачи: ${formData.get('type')}`,
      `Описание: ${formData.get('task')}`,
      `Файлы: ${attachedFiles.length ? attachedFiles.join(', ') : 'не приложены'}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(message);
    } catch (_error) {
      // Clipboard API may be unavailable in some browsers.
    }

    const mailto = `mailto:hello@step3d.pro?subject=${encodeURIComponent('Заявка с сайта Step3D')}&body=${encodeURIComponent(message)}`;
    window.location.href = mailto;
  });
});
