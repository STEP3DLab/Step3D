import { projects, courses } from './data.js';

// Render projects
const projectsGrid = document.getElementById('projectsGrid');
projects.forEach(p => {
  const card = document.createElement('a');
  card.href = p.link;
  card.className = 'block p-6 rounded-2xl bg-neutral-800 hover:bg-neutral-700 transition';
  card.innerHTML = `<h3 class="text-xl font-semibold mb-2">${p.title}</h3><p class="text-sm text-neutral-300">${p.summary}</p>`;
  projectsGrid.appendChild(card);
});

// Render courses
const coursesList = document.getElementById('coursesList');
courses.forEach(c => {
  const card = document.createElement('a');
  card.href = c.link;
  card.className = 'block p-6 rounded-2xl bg-neutral-900 border border-neutral-700 hover:border-orange-500 transition';
  card.innerHTML = `<div class="flex justify-between mb-2"><span class="text-sm text-neutral-400">${c.date}</span><span class="text-sm text-orange-500">${c.level}</span></div><h3 class="text-lg font-semibold">${c.title}</h3>`;
  coursesList.appendChild(card);
});

// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});
// Close menu on link click
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.classList.add('hidden');
}));
