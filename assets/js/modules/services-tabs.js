function activateServiceTab(targetTab, serviceTabs, servicePanels) {
  const key = targetTab.dataset.service;

  serviceTabs.forEach((tab) => {
    const isActive = tab === targetTab;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  servicePanels.forEach((panel) => {
    const isActive = panel.dataset.panel === key;
    panel.classList.toggle('is-active', isActive);
    panel.hidden = !isActive;
  });

  return key;
}

export function initServicesTabs({ onTypeChange } = {}) {
  const serviceTabs = [...document.querySelectorAll('.service-tab')];
  const servicePanels = [...document.querySelectorAll('.service-panel')];
  const select = document.getElementById('projectType');
  if (!serviceTabs.length || !servicePanels.length) return;

  serviceTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = activateServiceTab(tab, serviceTabs, servicePanels);
      if (select && ['scan', 'reverse', 'prototype', 'print'].includes(key)) {
        select.value = key;
        if (typeof onTypeChange === 'function') onTypeChange();
      }
    });
  });
}
