const THEMES = {
  midnight: {
    label: 'Темная',
    color: '#070b13'
  },
  graphite: {
    label: 'Графит',
    color: '#0e131c'
  },
  ivory: {
    label: 'Светлая',
    color: '#f5f7fb'
  }
};

const STORAGE_KEY = 'step3d-theme';

function applyTheme(nextTheme, buttons, themeColorMeta) {
  const safeTheme = THEMES[nextTheme] ? nextTheme : 'midnight';

  document.body.dataset.theme = safeTheme;
  localStorage.setItem(STORAGE_KEY, safeTheme);

  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', THEMES[safeTheme].color);
  }

  buttons.forEach((button) => {
    const isActive = button.dataset.theme === safeTheme;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

/**
 * Theme system keeps all palettes in CSS tokens and only toggles data-theme.
 * This preserves existing section logic while making the UI visually consistent.
 */
export function initTheme() {
  const buttons = [...document.querySelectorAll('.theme-btn')];
  if (!buttons.length) return;

  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  const preferredTheme = savedTheme && THEMES[savedTheme] ? savedTheme : 'midnight';

  applyTheme(preferredTheme, buttons, themeColorMeta);

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      applyTheme(button.dataset.theme, buttons, themeColorMeta);
    });
  });
}
