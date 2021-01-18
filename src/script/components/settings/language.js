import createElement from '../../utils/create';
import translations from '../../data/translations';

export function switchLanguage() {
  const currentLang = localStorage.getItem('lang') || 'en';

  const optionsHtml = `
    <select class="form-select languages">
        <option value="en" selected=${!!(currentLang === 'en')}>en</option>
        <option value="ru" selected=${!!(currentLang === 'ru')}>ru</option>
        <option value="be" selected=${!!(currentLang === 'be')}>be</option>
    </select>
    `;
  const langToggle = createElement('select', 'form-select languages', optionsHtml);

  langToggle.addEventListener('change', (e) => localStorage.setItem('lang', e.target.value));

  document.querySelector('main').append(langToggle);
}

export default function translatePage() {
  const language = localStorage.getItem('lang') || 'en';
  const elementsToTranslate = document.querySelectorAll('[data-i18n]');

  elementsToTranslate.forEach((el) => {
    if (el.classList.contains('day-of-week')) {
      el.textContent = `${translations[language][el.dataset.i18n.toLowerCase()]},`;
    } else if (el.classList.contains('date')) {
      console.log(el.dataset.i18n);
      el.textContent = translations[language].months[+el.dataset.i18n];
    } else {
      el.textContent = translations[language][el.dataset.i18n];
    }
  });
}
