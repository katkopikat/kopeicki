export default function switchTheme() {
  const toggleBtn = document.querySelector('.toggle-theme');
  toggleBtn.addEventListener('click', () => {
    if (document.documentElement.hasAttribute('theme')) {
      document.documentElement.removeAttribute('theme');
    } else {
      document.documentElement.setAttribute('theme', 'light');
    }
  });
}
