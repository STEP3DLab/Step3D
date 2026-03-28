import { initCases } from './modules/cases.js';
import { initServicesTabs } from './modules/services-tabs.js';
import { initFaq } from './modules/faq.js';
import { initEstimate } from './modules/estimate.js';
import { initBrief } from './modules/brief.js';
import { initModelViewer } from './modules/model-viewer.js';
import { initNav } from './modules/nav.js';
import { initHeroDynamic } from './modules/hero-dynamic.js';
import { initTheme } from './modules/theme.js';
import { initUx } from './modules/ux.js';

const APP_INIT_SENTINEL = '__step3d_app_initialized__';

/**
 * Single, predictable bootstrap entrypoint for the entire landing page.
 * Keeps init ordering explicit and prevents accidental double-listeners.
 */
function initApp() {
  if (window[APP_INIT_SENTINEL]) return;
  window[APP_INIT_SENTINEL] = true;

  const { updateEstimate } = initEstimate();
  initCases();
  initServicesTabs({ onTypeChange: updateEstimate });
  initFaq();
  initBrief();
  initNav();
  initHeroDynamic();
  initTheme();
  initUx();
  void initModelViewer();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp, { once: true });
} else {
  initApp();
}
