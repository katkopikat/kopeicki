import translations from '../../data/translations';

export default function translatePage() {
  const language = localStorage.getItem('lang') || 'en';
  const elementsToTranslate = document.querySelectorAll('[data-i18n]');

  elementsToTranslate.forEach((el) => {
    const tempEl = el;
    if (el.classList.contains('day-of-week')) {
      tempEl.textContent = `${translations[language][el.dataset.i18n.toLowerCase()]},`;
    } else if (el.classList.contains('date')) {
      tempEl.textContent = translations[language].months[+el.dataset.i18n];
    } else {
      tempEl.textContent = translations[language][el.dataset.i18n] || el.textContent;
    }
  });
}
