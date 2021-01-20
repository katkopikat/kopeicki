import createElement from '../../utils/create';
import createSelect from '../../utils/select';
import modal from './modal';
import api from '../../api';
import app from '../../app';
import renderHistory from '../transactions/history';

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
    list = [...app.user.accounts];
  } else {
    list = options.type === 'expenses' ? [...app.user.expenses] : [...app.user.income];
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

  const isExpense = options.type === 'expenses';

  document.querySelector('.modal-content').className = `modal-content ${options.type || options}`;

  const today = new Date().toISOString().split('T')[0];

  const wrap = createElement('div', 'content');

  wrap.insertAdjacentHTML(
    'afterbegin',
    `
      <h5 class="modal-body__title">${titleOptions[options.type] || options}</h5>
      <input class="modal-body__amount" placeholder="0.00" type="number">
      <span data-from>from</span>
      <br>
      <span data-to>on</span>
      <br>
      <input class="modal-body__date" type="date" value="${today}" max="${today}">
      <div class="form-floating">
        <textarea class="form-control" id="description" maxlength="45"></textarea>
        <label for="description" class="textarea-label">Do you have anything to say?</label>
      </div>
    `,
  );

  createSelect(wrap.querySelector('.modal-body__title'), {
    class: 'currency-list',
    placeholder: app.user.currency.toUpperCase(),
    list: api.currencyList,
  });

  createSelect(
    wrap.querySelector(isExpense ? '[data-from]' : '[data-to]'),
    preCreateSelect({ ...options, class: 'select__from' }),
  );
  createSelect(
    wrap.querySelector(isExpense ? '[data-to]' : '[data-from]'),
    preCreateSelect({ ...options, class: 'select__to' }),
  );

  const moneyAmountEl = wrap.querySelector('.modal-body__amount');
  const selectFromEl = wrap.querySelector('.select__from .select__value');
  const selectToEl = wrap.querySelector('.select__to .select__value');
  const dateEl = wrap.querySelector('.modal-body__date');
  const descriptionEl = wrap.querySelector('.form-control');

  const saveBtn = createElement('button', 'btn btn-light', saveBtnOptions[options.type]);
  wrap.append(saveBtn);

  setTimeout((() => {
    const currencyInput = document.querySelector('.modal-body__amount');
    currencyInput.onblur = () => {
      currencyInput.value = parseFloat(currencyInput.value).toFixed(2);
    };
  }), 0);

  const audioExpenses = new Audio();
  const audioIncome = new Audio();
  const audioAccounts = new Audio();

  audioIncome.src = '/src/assets/sounds/income.mp3';
  audioExpenses.src = '/src/assets/sounds/expenses.mp3';
  audioAccounts.src = '/src/assets/sounds/category.mp3';

  saveBtn.addEventListener('click', () => {
    const transactionInfo = {
      moneyAmount: moneyAmountEl.value,
      fromAccount: selectFromEl.textContent,
      to: selectToEl.textContent,
      date: dateEl.value,
      description: descriptionEl.value,
    };
    console.log(transactionInfo);

    const tx = {
      date: dateEl.value,
      user: api.userId,
      account: selectFromEl.textContent,
      amount: moneyAmountEl.value,
      category: selectToEl.textContent,
      type: `${options.type}`,
      description: descriptionEl.value,
    };
    api.saveTransaction(tx).then((result) => {
      console.log(result);
      renderHistory();
    });

    modal.hide();

    if (options.type === 'expenses') audioExpenses.play();
    else if (options.type === 'income') audioIncome.play();
    else audioAccounts.play();
  });

  return wrap;
}
