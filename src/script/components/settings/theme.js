export default function switchTheme() {
  const themeToggle = document.getElementById('theme');

  themeToggle.addEventListener('change', () => {
    const ball = document.querySelector('.ball');

    if (themeToggle.checked) {
      ball.style.transform = 'translateX(40px)';

      document.documentElement.setAttribute('theme', 'light');
    } else {
      ball.style.transform = 'translateX(0)';

      if (document.documentElement.hasAttribute('theme')) {
        document.documentElement.removeAttribute('theme');
      }
    }
  });
}
