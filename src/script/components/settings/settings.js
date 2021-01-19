import switchTheme from './theme';
import createSelect from '../../utils/select';
import { getLanguage, setLanguage } from '../../utils/localStorage';

export default function toggleSettings() {
  const themeToggleEl = document.querySelector('.theme-toggle');
  switchTheme();
  createSelect(themeToggleEl, {
    class: 'select__language',
    placeholder: getLanguage(),
    list: ['en', 'ru', 'be'],
    onSelect: setLanguage,
  });
}
