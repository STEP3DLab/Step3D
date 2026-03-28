const words = [
  '3D-сканирования',
  'реверсивного инжиниринга',
  'прототипирования',
  'подготовки к печати',
  'производственного вау-результата'
];

export function initHeroDynamic() {
  const node = document.getElementById('heroDynamicWord');
  if (!node) return;

  let idx = 0;
  window.setInterval(() => {
    idx = (idx + 1) % words.length;
    node.textContent = words[idx];
    node.style.animation = 'none';
    node.offsetHeight;
    node.style.animation = '';
  }, 2400);
}
