export function initFaq() {
  const items = [...document.querySelectorAll('.faq-item')];
  const searchInput = document.getElementById('faqSearch');
  const resultCount = document.getElementById('faqResultCount');
  const expandAllBtn = document.getElementById('faqExpandAll');
  const collapseAllBtn = document.getElementById('faqCollapseAll');

  const updateCount = () => {
    if (!resultCount) return;
    const visible = items.filter((item) => !item.hidden).length;
    resultCount.textContent = `Показано ${visible} из ${items.length}`;
  };

  const openItem = (item) => {
    const button = item.querySelector('.faq-q');
    const content = item.querySelector('.faq-a');
    if (!button || !content) return;
    item.classList.add('is-open');
    button.setAttribute('aria-expanded', 'true');
    content.style.maxHeight = `${content.scrollHeight}px`;
  };

  const closeItem = (item) => {
    const button = item.querySelector('.faq-q');
    const content = item.querySelector('.faq-a');
    if (!button || !content) return;
    item.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    content.style.maxHeight = '0px';
  };

  items.forEach((item, index) => {
    const button = item.querySelector('.faq-q');
    const content = item.querySelector('.faq-a');
    if (!button || !content) return;

    const contentId = content.id || `faq-panel-${index + 1}`;
    content.id = contentId;
    button.setAttribute('aria-controls', contentId);

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      items.forEach((other) => {
        closeItem(other);
      });

      if (!isOpen) openItem(item);
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        item.hidden = query.length > 0 && !text.includes(query);
      });
      updateCount();
    });
  }

  expandAllBtn?.addEventListener('click', () => items.filter((item) => !item.hidden).forEach(openItem));
  collapseAllBtn?.addEventListener('click', () => items.forEach(closeItem));
  updateCount();
}
