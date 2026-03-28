document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('caseGrid');
  const cases = window.STEP3D_CASES || [];
  const render = (filter = 'all') => {
    if (!grid) return;
    grid.innerHTML = '';
    cases
      .filter((c) => filter === 'all' || c.type.includes(filter))
      .forEach((c) => {
        const el = document.createElement('article');
        el.className = 'card case-card';
        el.innerHTML = `<h3>${c.title}</h3><p>${c.summary}</p><div class="meta">${c.meta}</div>`;
        grid.appendChild(el);
      });
  };
  render();

  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((x) => x.classList.remove('is-active'));
      btn.classList.add('is-active');
      render(btn.dataset.filter || 'all');
    });
  });

  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const text = `Заявка STEP_3D\nИмя: ${data.get('name')}\nКонтакт: ${data.get('contact')}\nЗадача: ${data.get('task')}`;
    navigator.clipboard.writeText(text).then(() => alert('Текст заявки скопирован в буфер обмена.'));
  });
});
