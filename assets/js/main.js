import { initCases } from './modules/cases.js';
import { initServicesTabs } from './modules/services-tabs.js';
import { initFaq } from './modules/faq.js';
import { initEstimate } from './modules/estimate.js';
import { initBrief } from './modules/brief.js';
import { initModelViewer } from './modules/model-viewer.js';
import { initNav } from './modules/nav.js';

const { updateEstimate } = initEstimate();
initCases();
initServicesTabs({ onTypeChange: updateEstimate });
initFaq();
initBrief();
initNav();
void initModelViewer();
