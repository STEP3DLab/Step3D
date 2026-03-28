function activateServiceTab(targetTab, serviceTabs, servicePanels, { moveFocus = false } = {}) {
  const key = targetTab.dataset.service;

  serviceTabs.forEach((tab) => {
    const isActive = tab === targetTab;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });

  servicePanels.forEach((panel) => {
    const isActive = panel.dataset.panel === key;
    panel.classList.toggle('is-active', isActive);
    panel.hidden = !isActive;
  });

  if (moveFocus) {
    targetTab.focus();
  }

  return key;
}

function moveFocusBy(serviceTabs, currentIndex, delta) {
  const nextIndex = (currentIndex + delta + serviceTabs.length) % serviceTabs.length;
  serviceTabs[nextIndex].focus();
}

export function initServicesTabs({ onTypeChange } = {}) {
  const serviceTabs = [...document.querySelectorAll('.service-tab')];
  const servicePanels = [...document.querySelectorAll('.service-panel')];
  const select = document.getElementById('projectType');
  if (!serviceTabs.length || !servicePanels.length) return;

  const syncEstimateType = (key) => {
    if (select && ['scan', 'reverse', 'prototype', 'print'].includes(key)) {
      select.value = key;
      if (typeof onTypeChange === 'function') onTypeChange();
    }
  };

  const initiallyActive = serviceTabs.find((tab) => tab.classList.contains('is-active')) || serviceTabs[0];
  syncEstimateType(activateServiceTab(initiallyActive, serviceTabs, servicePanels));

  serviceTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      const key = activateServiceTab(tab, serviceTabs, servicePanels);
      syncEstimateType(key);
    });

    tab.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        moveFocusBy(serviceTabs, index, 1);
      }

      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        moveFocusBy(serviceTabs, index, -1);
      }

      if (event.key === 'Home') {
        event.preventDefault();
        serviceTabs[0].focus();
      }

      if (event.key === 'End') {
        event.preventDefault();
        serviceTabs[serviceTabs.length - 1].focus();
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const key = activateServiceTab(tab, serviceTabs, servicePanels, { moveFocus: true });
        syncEstimateType(key);
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        tab.blur();
      }
    });
  });
}
