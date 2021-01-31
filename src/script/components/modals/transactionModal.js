import moment from 'moment';
import createElement from '../../utils/create';
import createSelect from '../../utils/select';
import modal from './modal';
import showPopover from '../popover';
import api from '../../api';
import app from '../../app';
import { getLanguage, getSound } from '../../utils/localStorage';
import getExchangeData from '../settings/currencyConverter';
import pubsub from '../../pubsub';

/* options = {
 *    type: 'expenses',
 *    from: 'Bank account',
 *    to: 'Eating out',
 *  };
 */
function preloader() {
  const preloaderEl = document.getElementById('preloader');
  preloaderEl.classList.toggle('visible');
}

function preCreateSelect(options) {
  const isFromSelect = options.class.includes('from');

  let categoryList;

  if (isFromSelect) {
    categoryList = [...app.user.accounts];
  } else {
    categoryList = options.type === 'expenses' ? [...app.user.expenses] : [...app.user.income];
  }

  const list = categoryList.map(({ name }) => name);

  return {
    class: options.class,
    placeholder: isFromSelect ? options.from || 'Choose an account' : options.to || `Choose ${options.type}`,
    list,
    isTranslatable: true,
  };
}

export default function transactionModal(options) {
  const lang = getLanguage();

  const titleOptions = {
    expenses: {
      en: 'Spent',
      ru: 'Потратил',
      by: 'Патраціў',
    },
    income: {
      en: 'Earned',
      ru: 'Заработал',
      by: 'Зарабіў',
    },
  };

  const saveBtnOptions = {
    expenses: {
      en: 'Spent it!',
      ru: 'Потрачено!',
      by: 'Патрачано!',
    },
    income: {
      en: 'Received!',
      ru: 'Получено!',
      by: 'Атрымаў!',
    },
  };

  const descriptionLabels = {
    en: 'Do you have anything to say?',
    ru: 'Как-то прокомментируем?',
    by: 'Неяк пракамэнтуем?',
  };

  const from = { en: 'from', ru: 'из', by: 'з' };
  const on = { en: 'on', ru: 'на', by: 'на' };

  const errorMessage = {
    en: 'Please fill out all the fields',
    ru: 'Пожалуйста, заполните все поля',
    by: 'Калі ласка, запоўніце ўсе палі',
  };

  const invalidSum = {
    en: 'Transaction amount must not be equal to 0',
    ru: 'Сумма операции не должна быть нулевой',
    by: 'Сума аперацыі павінна быць ненулявой',
  };

  const isExpense = options.type === 'expenses';

  document.querySelector('.modal-content').className = `modal-content ${options.type}`;

  const today = moment().format('YYYY-MM-DD');

  const wrap = createElement('div', 'content');

  wrap.insertAdjacentHTML(
    'afterbegin',
    `
      <h5 class="modal-body__title">${titleOptions[options.type][lang]}</h5>
      <input class="modal-body__amount" placeholder="0.00" type="number">
      <br>
      <span data-from>${from[lang]}</span>
      <br>
      <span data-to>${on[lang]}</span>
      <br>
      <input class="modal-body__date" type="date" value="${today}" max="${today}">
      <div class="form-floating">
        <textarea class="form-control" id="description" maxlength="45"></textarea>
        <label for="description" class="textarea-label">${descriptionLabels[lang]}</label>
      </div>
    `,
  );

  createSelect(wrap.querySelector('.modal-body__title'), {
    class: 'currency-list',
    placeholder: app.user.currency.toUpperCase(),
    list: [...['USD', 'EUR', 'RUB', 'BYN', 'UAH', 'KZT'], ...api.currencyList],
    isTranslatable: false,
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

  const saveBtn = createElement('button', 'btn btn-light', saveBtnOptions[options.type][lang]);
  wrap.append(saveBtn);

  setTimeout(() => {
    const currencyInput = document.querySelector('.modal-body__amount');
    currencyInput.onblur = () => {
      currencyInput.value = parseFloat(Math.abs(currencyInput.value)).toFixed(2);
    };
  }, 0);

  saveBtn.addEventListener('click', () => {
    const tx = {
      date: dateEl.value,
      user: api.userId,
      account: selectFromEl.id,
      amount: moneyAmountEl.value,
      category: selectToEl.id,
      type: `${options.type}`,
      description: descriptionEl.value,
    };

    const isAccountInvalid = tx.account === 'Choose an account';
    const isCategoryInvalid = tx.category === `Choose ${options.type}`;

    const currencyFrom = document.querySelector('.currency-list .select__value').innerText;

    if (!tx.amount || isAccountInvalid || isCategoryInvalid) {
      showPopover(saveBtn, errorMessage[lang], 'right');
    } else if (+tx.amount === 0) {
      showPopover(moneyAmountEl, invalidSum[lang], 'bottom');
    } else {
      getExchangeData(moneyAmountEl.value, currencyFrom)
        .then((exchange) => {
          preloader();
          tx.amount = exchange;

          const toCurrency = app.user.currency.toUpperCase();
          if (toCurrency !== currencyFrom) {
            tx.description = `${moneyAmountEl.value} ${currencyFrom} //
          ${descriptionEl.value}`;
          }
        })
        .then(() => {
          app.saveTransaction(tx).then((result) => {
            console.log(result);
            pubsub.publish('renderTransactionsPage');
          });
        });

      modal.hide();
      setTimeout(preloader, 1500);

      if (getSound() === 'on') {
        const sound = new Audio();
        sound.src = `sounds/${options.type}.mp3`;
        sound.play();
      }
    }
  });

  return wrap;
}
