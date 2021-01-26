import { getTheme, setTheme } from '../../utils/localStorage';
import { moveToggle } from '../../utils/DOM';

export default function switchTheme() {
  const themeToggleDiv = document.querySelector('.toggle.theme');
  const themeToggle = document.getElementById('theme');
  const width = 24;

  const isChecked = getTheme() === 'light';

  document.documentElement.setAttribute('theme', getTheme());
  moveToggle(themeToggleDiv, width, isChecked);
  themeToggle.checked = isChecked;

  themeToggle.addEventListener('change', () => {
    const transition = () => {
      document.documentElement.classList.add('transition');
      window.setTimeout(() => {
        document.documentElement.classList.remove('transition');
      }, 1000);
    };

    moveToggle(themeToggleDiv, width, themeToggle.checked);
    transition();
    setTheme(themeToggle.checked ? 'light' : 'dark');
  });
}
