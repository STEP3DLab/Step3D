export function initFaq() {
  document.querySelectorAll('.faq-item').forEach((item) => {
    const button = item.querySelector('.faq-q');
    const content = item.querySelector('.faq-a');
    if (!button || !content) return;

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item').forEach((other) => {
        other.classList.remove('is-open');
        const otherContent = other.querySelector('.faq-a');
        if (otherContent) otherContent.style.maxHeight = 0;
      });
      if (!isOpen) {
        item.classList.add('is-open');
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });
  });
}
