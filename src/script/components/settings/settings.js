import switchTheme from './theme';
import toggleSound from './sound';
import createSelect from '../../utils/select';
import { getLanguage, setLanguage } from '../../utils/localStorage';

export default function toggleSettings() {
  const selectEl = document.querySelector('.lang-select');

  createSelect(selectEl, {
    class: 'select__language',
    placeholder: getLanguage(),
    list: ['en', 'ru', 'be'],
    onSelect: setLanguage,
    isTranslatable: true,
  });

  switchTheme();
  toggleSound();
}
