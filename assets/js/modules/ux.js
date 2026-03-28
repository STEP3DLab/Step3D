const STORAGE_KEYS = {
  fontScale: 'step3d-font-scale',
  highContrast: 'step3d-high-contrast',
  reduceMotion: 'step3d-reduce-motion'
};

function showToast(message) {
  const toast = document.getElementById('uiToast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 1800);
}

export function initUx() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  const toggleContrastBtn = document.getElementById('toggleContrastBtn');
  const toggleMotionBtn = document.getElementById('toggleMotionBtn');
  const fontPlusBtn = document.getElementById('fontPlusBtn');
  const fontMinusBtn = document.getElementById('fontMinusBtn');
  if (!backToTopBtn || !toggleContrastBtn || !toggleMotionBtn || !fontPlusBtn || !fontMinusBtn) return;

  const applyFontScale = (rawScale) => {
    const scale = Math.min(1.2, Math.max(0.9, rawScale));
    document.documentElement.style.fontSize = `${Math.round(scale * 100)}%`;
    localStorage.setItem(STORAGE_KEYS.fontScale, String(scale));
    return scale;
  };

  const setContrast = (enabled) => {
    document.body.classList.toggle('high-contrast', enabled);
    toggleContrastBtn.setAttribute('aria-pressed', String(enabled));
    localStorage.setItem(STORAGE_KEYS.highContrast, String(enabled));
  };

  const setReducedMotion = (enabled) => {
    document.body.classList.toggle('reduce-motion', enabled);
    toggleMotionBtn.setAttribute('aria-pressed', String(enabled));
    localStorage.setItem(STORAGE_KEYS.reduceMotion, String(enabled));
  };

  const savedScale = Number(localStorage.getItem(STORAGE_KEYS.fontScale));
  if (!Number.isNaN(savedScale) && savedScale > 0) applyFontScale(savedScale);
  setContrast(localStorage.getItem(STORAGE_KEYS.highContrast) === 'true');
  setReducedMotion(localStorage.getItem(STORAGE_KEYS.reduceMotion) === 'true');

  window.addEventListener(
    'scroll',
    () => backToTopBtn.classList.toggle('is-visible', window.scrollY > 680),
    { passive: true }
  );

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Поднялись наверх');
  });

  toggleContrastBtn.addEventListener('click', () => {
    const next = toggleContrastBtn.getAttribute('aria-pressed') !== 'true';
    setContrast(next);
    showToast(next ? 'Контраст усилен' : 'Контраст стандартный');
  });

  toggleMotionBtn.addEventListener('click', () => {
    const next = toggleMotionBtn.getAttribute('aria-pressed') !== 'true';
    setReducedMotion(next);
    showToast(next ? 'Анимации отключены' : 'Анимации включены');
  });

  fontPlusBtn.addEventListener('click', () => {
    const current = Number(localStorage.getItem(STORAGE_KEYS.fontScale)) || 1;
    applyFontScale(current + 0.05);
    showToast('Размер текста увеличен');
  });

  fontMinusBtn.addEventListener('click', () => {
    const current = Number(localStorage.getItem(STORAGE_KEYS.fontScale)) || 1;
    applyFontScale(current - 0.05);
    showToast('Размер текста уменьшен');
  });
}
