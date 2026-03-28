export function initFaq() {
  const items = [...document.querySelectorAll('.faq-item')];

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
        other.classList.remove('is-open');
        const otherButton = other.querySelector('.faq-q');
        const otherContent = other.querySelector('.faq-a');
        if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
        if (otherContent) otherContent.style.maxHeight = '0px';
      });

      if (!isOpen) {
        item.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });
  });
}
