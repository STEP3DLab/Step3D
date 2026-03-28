import { CASES_DATA } from '../../data/cases.js';
import { validateCaseData } from './data-guards.js';

export function initCases() {
  const caseItems = document.querySelectorAll('.case-item');
  const caseTitle = document.getElementById('caseTitle');
  const caseStats = document.getElementById('caseStats');
  const caseBody = document.getElementById('caseBody');
  const caseFooterText = document.getElementById('caseFooterText');
  const casePhotoTitle = document.getElementById('casePhotoTitle');
  const casePhotoCaption = document.getElementById('casePhotoCaption');
  const caseThumbRow = document.getElementById('caseThumbRow');
  if (!caseItems.length || !caseTitle || !caseStats || !caseBody || !caseFooterText || !casePhotoTitle || !casePhotoCaption || !caseThumbRow) return;

  const renderCase = (id) => {
    const data = CASES_DATA[id];
    if (!data) return;
    validateCaseData(id, data);

    caseTitle.textContent = data.title;
    caseFooterText.textContent = data.footer;
    casePhotoTitle.textContent = data.photoTitle;
    casePhotoCaption.textContent = data.photoCaption;
    caseThumbRow.innerHTML = data.photoSlots.map((slot) => `<div class="case-thumb">${slot}</div>`).join('');
    caseStats.innerHTML = data.stats.map(([label, value]) => `<div class="case-stat"><strong>${label}</strong><span>${value}</span></div>`).join('');
    caseBody.innerHTML = data.columns
      .map((col) => `<div class="case-column"><strong>${col.title}</strong><ul>${col.items.map((item) => `<li>${item}</li>`).join('')}</ul></div>`)
      .join('');
  };

  caseItems.forEach((item) => {
    item.addEventListener('click', () => {
      caseItems.forEach((btn) => btn.classList.remove('is-active'));
      item.classList.add('is-active');
      renderCase(item.dataset.case);
    });
  });

  renderCase('case1');
}
