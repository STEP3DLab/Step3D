import { projects, courses } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  renderCourses();
  initMenu();
});

function renderProjects() {
  const container = document.getElementById('projects-container');
  container.innerHTML = projects.map(p => `
    <a href="${p.link}" class="block bg-white text-gray-900 rounded-2xl shadow p-6 transition hover:shadow-lg">
      <h3 class="text-xl font-semibold mb-2">${p.title}</h3>
      <p class="text-sm">${p.summary}</p>
    </a>
  `).join('');
}

function renderCourses() {
  const container = document.getElementById('courses-container');
  container.innerHTML = courses.map(c => `
    <a href="${c.link}" class="block bg-white text-gray-900 rounded-2xl shadow p-6 mb-4 transition hover:shadow-lg">
      <div class="text-sm text-gray-500">${c.date} · ${c.level}</div>
      <h3 class="text-lg font-semibold">${c.title}</h3>
    </a>
  `).join('');
}

function initMenu() {
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('menu');
  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });
}
