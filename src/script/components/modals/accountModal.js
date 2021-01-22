import createElement from '../../utils/create';
import { getLanguage } from '../../utils/localStorage';
import transactionModal from './transactionModal';

export default function accountModal(options) {
  const lang = getLanguage();

  const titleOptions = {
    en: 'What do we do?',
    ru: 'Что будем делать?',
    be: 'Што будзем рабіць?',
  };

  const expenseBtn = {
    en: 'Spend money!',
    ru: 'Тратить деньги!',
    be: 'Траціць грошы!',
  };

  const incomeBtn = {
    en: 'Get money!',
    ru: 'Получать деньги!',
    be: 'Атрымліваць грошы!',
  };

  document.querySelector('.modal-content').className = `modal-content ${options.type}`;

  const wrap = createElement('div', 'content');

  wrap.insertAdjacentHTML(
    'afterbegin',
    `<h5 class="modal-body__title">${titleOptions[lang]}</h5>
    <div class="btns-container">
      <button class="btn expenses" data-type="expenses">${expenseBtn[lang]}</button>
      <button class="btn income" data-type="income">${incomeBtn[lang]}</button>
    </div>`,
  );

  const buttons = wrap.querySelector('.btns-container');

  buttons.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const modalContent = document.querySelector('[data-content]');

      wrap.parentNode.removeChild(wrap);
      modalContent.append(transactionModal({ type: e.target.dataset.type, from: options.from }));
    }
  });

  return wrap;
}
