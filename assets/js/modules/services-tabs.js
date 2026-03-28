export function initServicesTabs({ onTypeChange } = {}) {
  const serviceTabs = document.querySelectorAll('.service-tab');
  const servicePanels = document.querySelectorAll('.service-panel');
  const select = document.getElementById('projectType');

  serviceTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.service;

      serviceTabs.forEach((btn) => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-selected', 'false');
      });
      servicePanels.forEach((panel) => panel.classList.remove('is-active'));

      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      const target = document.querySelector(`.service-panel[data-panel="${key}"]`);
      if (target) target.classList.add('is-active');

      if (select && ['scan', 'reverse', 'prototype', 'print'].includes(key)) {
        select.value = key;
        if (typeof onTypeChange === 'function') onTypeChange();
      }
    });
  });
}
