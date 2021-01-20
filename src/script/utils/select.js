import createElement from './create';
import { insertAfter } from './DOM';
import { getLanguage } from './localStorage';
import translations from '../data/translations';

/* content = {
 *    class: String,
 *    placeholder: String,
 *    list: Array,
 *    onSelect: Function,
 *  }
 */

export default function createSelect(siblingEl, content) {
  const lang = getLanguage();

  const translate = (text) => translations[lang][text] || text;

  const getTemplate = (data) => {
    const options = data.list.map((item) => {
      if (data.placeholder === item) {
        return `<li class="select__item selected">${translate(item)}</li>`;
      }
      return `<li class="select__item">${translate(item)}</li>`;
    });

    return `
    <div class="select__backdrop"></div>
    <div class="select__input ${content.class}">
      <span class="select__value">${translate(data.placeholder)}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
       <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
      </svg>
    </div>
    <div class="select__dropdown">
      <ul class="select__list">
        ${options.join('')}
      </ul>
    </div>
    `;
  };

  const selectEl = createElement('div', 'select', getTemplate(content));

  selectEl.addEventListener('click', (e) => {
    const input = e.target.closest('.select__input');
    const backdrop = e.target.matches('.select__backdrop');
    const option = e.target.matches('.select__item');
    const placeholder = selectEl.querySelector('.select__value');

    if (input || backdrop) {
      selectEl.classList.toggle('open');
    } else if (option) {
      const value = e.target.innerText;

      selectEl.querySelectorAll('.select__item').forEach((el) => el.classList.remove('selected'));
      e.target.classList.add('selected');

      placeholder.textContent = value;

      if (content.onSelect) content.onSelect(value);

      selectEl.classList.toggle('open');
    }
  });

  insertAfter(selectEl, siblingEl);
}
