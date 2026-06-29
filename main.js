const toggle = document.getElementById('themeToggle');
const html = document.documentElement;

const saved = localStorage.getItem('theme') || 'light';
html.dataset.theme = saved;
toggle.checked = saved === 'dark';

toggle.addEventListener('change', () => {
  const theme = toggle.checked ? 'dark' : 'light';
  html.dataset.theme = theme;
  localStorage.setItem('theme', theme);
});
