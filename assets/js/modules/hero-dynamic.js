const words = [
  '3D-сканирования',
  'реверсивного инжиниринга',
  'прототипирования',
  'подготовки к печати',
  'производственного вау-результата'
];

const ROTATION_INTERVAL_MS = 2400;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function initHeroDynamic() {
  const node = document.getElementById('heroDynamicWord');
  if (!node) return;

  if (prefersReducedMotion()) {
    node.textContent = words[0];
    return;
  }

  let idx = 0;
  let timeoutId = 0;

  const tick = () => {
    idx = (idx + 1) % words.length;
    node.textContent = words[idx];
    node.style.animation = 'none';
    // Force reflow to restart keyframe animation deterministically.
    void node.offsetHeight;
    node.style.animation = '';
    timeoutId = window.setTimeout(tick, ROTATION_INTERVAL_MS);
  };

  const pause = () => {
    window.clearTimeout(timeoutId);
  };

  const resume = () => {
    pause();
    timeoutId = window.setTimeout(tick, ROTATION_INTERVAL_MS);
  };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pause();
    } else {
      resume();
    }
  });

  resume();
}
