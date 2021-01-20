export default function switchTheme() {
  const themeToggle = document.getElementById('theme');

  themeToggle.addEventListener('change', () => {
    const ball = document.querySelector('.ball');

    const transition = () => {
      document.documentElement.classList.add('transition');
      window.setTimeout(() => {
        document.documentElement.classList.remove('transition');
      }, 1000);
    };

    if (themeToggle.checked) {
      ball.style.transform = 'translateX(40px)';
      transition();
      document.documentElement.setAttribute('theme', 'light');
    } else {
      ball.style.transform = 'translateX(0)';
      transition();
      if (document.documentElement.hasAttribute('theme')) {
        document.documentElement.removeAttribute('theme');
      }
    }
  });
}
