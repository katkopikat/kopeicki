import createElement from '../../utils/create';
import { insertAfter } from '../../utils/DOM';
import createSelect from '../../utils/select';
import modal from './modal';
import api from '../../api';
import renderHistory from '../transactions/history';
import allAccountsCategories from '../../data/accounts';
import allExpensesCategories from '../../data/expenses';
import allIncomeCategories from '../../data/income';

/* options = {
 *    type: 'expenses',
 *    from: 'Bank account',
 *    to: 'Eating out',
 *  };
 */

function preCreateSelect(options) {
  const isFromSelect = options.class.includes('from');

  let list;

  if (isFromSelect) {
    list = [...allAccountsCategories];
  } else {
    list = options.type === 'expenses' ? [...allExpensesCategories] : [...allIncomeCategories];
  }

  const names = list.map(({ name }) => name);

  return {
    class: options.class,
    placeholder: isFromSelect ? options.from || 'Choose an account' : options.to,
    list: names,
  };
}

export default function transactionModal(options) {
  const titleOptions = {
    accounts: 'I dont know what to do with the money',
    expenses: 'Spent',
    income: 'Earned',
  };

  const saveBtnOptions = {
    accounts: 'Done!',
    expenses: 'Spent it!',
    income: 'Received!',
  };

  document.querySelector('.modal-content').className = `modal-content ${options.type || options}`;

  const today = new Date().toISOString().split('T')[0];

  const wrap = createElement('div', 'content');

  wrap.insertAdjacentHTML(
    'afterbegin',
    `
      <h5 class="modal-body__title">${titleOptions[options.type] || options}</h5>
      <span>BYN</span>
      <span data-from>from</span>
      <span data-to>on</span>
      <div class="form-floating">
        <label for="description" class="textarea-label">Do you have anything to say?</label>
      </div>
    `,
  );

  createSelect(wrap.querySelector('[data-from]'), preCreateSelect({ ...options, class: 'select__from' }));
  createSelect(wrap.querySelector('[data-to]'), preCreateSelect({ ...options, class: 'select__to' }));

  const moneyAmount = createElement(
    'input',
    'modal-body__amount',
    '0.00',
    ['placeholder', '0.00'],
    ['type', 'number'],
  );

  const date = createElement('input', 'modal-body__date', null, ['type', 'date'], ['value', today], ['max', today]);
  const description = createElement('textarea', 'form-control', null, ['id', 'description'], ['maxlength', 45]);

  const selectFrom = wrap.querySelector('.select__from .select__value');
  const selectTo = wrap.querySelector('.select__to .select__value');
  // const currency = createElement('span', 'modal-body__currency', 'BYN');

  const saveBtn = createElement('button', 'btn', saveBtnOptions[options.type]);

  insertAfter(moneyAmount, wrap.querySelector('.modal-body__title'));
  wrap.insertBefore(date, wrap.querySelector('.form-floating'));
  wrap.querySelector('.form-floating').prepend(description);
  wrap.append(saveBtn);

  saveBtn.addEventListener('click', () => {
    const transactionInfo = {
      moneyAmount: moneyAmount.innerText,
      fromAccount: selectFrom.textContent,
      to: selectTo.textContent,
      date: date.value,
      description: description.value,
    };
    console.log(transactionInfo);

    const tx = {
      date: date.value, // todo time?
      user: api.userId,
      account: selectFrom.textContent,
      amount: moneyAmount.innerText,
      category: selectTo.textContent,
      type: `${options.type}`,
      description: description.value,
    };
    api.saveTransaction(tx).then((result) => {
      console.log(result);
      renderHistory();
    });

    modal.hide();
  });

  return wrap;
}
