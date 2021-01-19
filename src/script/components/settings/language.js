/* eslint-disable no-param-reassign */
import translations from '../../data/translations';

export default function translatePage() {
  const language = localStorage.getItem('lang') || 'en';
  const elementsToTranslate = document.querySelectorAll('[data-i18n]');

  elementsToTranslate.forEach((el) => {
    if (el.classList.contains('day-of-week')) {
      el.textContent = `${translations[language][el.dataset.i18n.toLowerCase()]},`;
    } else if (el.classList.contains('date')) {
      el.textContent = translations[language].months[+el.dataset.i18n];
    } else {
      el.textContent = translations[language][el.dataset.i18n];
    }
  });
}
