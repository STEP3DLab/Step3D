function debounce(callback, delay = 180) {
  let timer = 0;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => callback(...args), delay);
  };
}

export function initFaq() {
  const items = [...document.querySelectorAll('.faq-item')];
  const searchInput = document.getElementById('faqSearch');
  const resultCount = document.getElementById('faqResultCount');
  const expandAllBtn = document.getElementById('faqExpandAll');
  const collapseAllBtn = document.getElementById('faqCollapseAll');
  if (!items.length) return;

  const updateCount = () => {
    if (!resultCount) return;
    const visible = items.filter((item) => !item.hidden).length;
    const nextText = `Показано ${visible} из ${items.length}`;
    if (resultCount.textContent !== nextText) {
      resultCount.textContent = nextText;
    }
  };

  const updateCountDebounced = debounce(updateCount);

  const openItem = (item) => {
    const button = item.querySelector('.faq-q');
    const content = item.querySelector('.faq-a');
    if (!button || !content) return;
    item.classList.add('is-open');
    button.setAttribute('aria-expanded', 'true');
    content.hidden = false;
    content.setAttribute('aria-hidden', 'false');
    content.style.maxHeight = `${content.scrollHeight}px`;
  };

  const closeItem = (item) => {
    const button = item.querySelector('.faq-q');
    const content = item.querySelector('.faq-a');
    if (!button || !content) return;
    item.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    content.setAttribute('aria-hidden', 'true');
    content.style.maxHeight = '0px';
  };

  items.forEach((item, index) => {
    const button = item.querySelector('.faq-q');
    const content = item.querySelector('.faq-a');
    if (!button || !content) return;

    const contentId = content.id || `faq-panel-${index + 1}`;
    content.id = contentId;
    button.setAttribute('aria-controls', contentId);

    if (item.classList.contains('is-open')) {
      content.hidden = false;
      content.setAttribute('aria-hidden', 'false');
    } else {
      content.hidden = true;
      content.setAttribute('aria-hidden', 'true');
    }

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      items.forEach((other) => {
        if (other !== item) closeItem(other);
      });

      if (isOpen) {
        closeItem(item);
      } else {
        openItem(item);
      }
    });

    button.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeItem(item);
        button.focus();
      }
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        const isMatch = query.length === 0 || text.includes(query);
        item.hidden = !isMatch;
        if (!isMatch) closeItem(item);
      });
      updateCountDebounced();
    });

    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        searchInput.value = '';
        items.forEach((item) => {
          item.hidden = false;
        });
        updateCount();
        searchInput.blur();
      }
    });
  }

  expandAllBtn?.addEventListener('click', () => {
    items.filter((item) => !item.hidden).forEach(openItem);
    updateCountDebounced();
  });

  collapseAllBtn?.addEventListener('click', () => {
    items.forEach(closeItem);
    updateCountDebounced();
  });

  [expandAllBtn, collapseAllBtn].forEach((button) => {
    button?.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        button.blur();
      }
    });
  });

  updateCount();
}
