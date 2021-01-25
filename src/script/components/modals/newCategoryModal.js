import createElement from '../../utils/create';
import modal from './modal';
import api from '../../api';
import app from '../../app';
import createSelect from '../../utils/select';
import { getLanguage } from '../../utils/localStorage';

export default function newCategoryModal(type) {
  const lang = getLanguage();

  const audioCategory = new Audio();
  audioCategory.src = '/src/assets/sounds/category.mp3';

  const titleOptions = {
    accounts: {
      en: 'Do you have a new account?',
      ru: 'Хотите завести новый счет?',
      be: 'Хочаце завесці новы рахунак?',
    },
    expenses: {
      en: 'What else will you spend money on?',
      ru: 'На что еще будем тратить деньги?',
      be: 'На што яшчэ будзем траціць грошы?',
    },
    income: {
      en: 'Where else will you get money from?',
      ru: 'Где еще будем брать деньги?',
      be: 'Адкуль яшчэ будзем браць грошы?',
    },
  };

  const saveBtnOptions = {
    en: 'Create!',
    ru: 'Создать!',
    be: 'Стварыць!',
  };

  const numOfItems = {
    accounts: 11,
    expenses: 46,
    income: 14,
  };

  document.querySelector('.modal-content').className = `modal-content ${type} new-category`;

  const wrap = createElement('div', 'content new-category');

  const title = createElement('h5', 'title', titleOptions[type][lang]);
  const newCategoryName = createElement('input', 'new-category__name', null, ['type', 'text']);
  const iconsContainer = createElement('div', 'new-category__icons');

  for (let i = numOfItems[type]; i >= 0; i -= 1) {
    const imgSrc = `/icons/new_${type}/${i}.svg`;
    const isChecked = i === 0 ? 'selected' : '';

    iconsContainer.insertAdjacentHTML(
      'afterbegin',
      `
        <label style="background-image: url(${imgSrc})" for="${i}" class="${isChecked}">
        <input id="${i}" type="radio" value="${imgSrc}" name="icon" ${i === 0 ? 'checked' : ''}>
        </label>
      `,
    );
  }

  iconsContainer.addEventListener('click', () => {
    const selected = wrap.querySelector('input[name="icon"]:checked');

    if (selected) {
      wrap.querySelectorAll('.selected').forEach((el) => el.classList.remove('selected'));

      selected.parentElement.classList.add('selected');
    }
  });

  const saveBtn = createElement('button', 'btn btn-light', saveBtnOptions[lang]);

  [title, newCategoryName, iconsContainer, saveBtn].forEach((el) => wrap.append(el));

  if (type === 'accounts') {
    const moneyAmount = createElement(
      'input',
      'modal-body__amount',
      null,
      ['type', 'number'],
      ['value', '0.00'],
      ['placeholder', '0.00'],
    );

    wrap.insertBefore(moneyAmount, iconsContainer);

    setTimeout(() => {
      moneyAmount.onblur = () => {
        moneyAmount.value = parseFloat(moneyAmount.value).toFixed(2);
      };
    }, 0);

    const currency = createElement('span', 'new-account_currency');
    currency.innerText = app.user.currency.toUpperCase();

    wrap.insertBefore(currency, iconsContainer);
  }

  saveBtn.addEventListener('click', async () => {
    const icon = wrap.querySelector('input[name="icon"]:checked').value;

    const newCategoryItem = {
      name: newCategoryName.value,
      icon,
    };

    if (type === 'accounts') {
      newCategoryItem.amount = wrap.querySelector('.modal-body__amount').innerText;
      newCategoryItem.currency = wrap.querySelector('.currency-list .select__value').innerText;

      await app.addUserAccount(newCategoryItem);
      app.renderTransactionsPage();
    } else if (type === 'expenses') {
      await app.addUserExpense(newCategoryItem);
      app.renderTransactionsPage();
    } else {
      await app.addUserIncome(newCategoryItem);
      app.renderTransactionsPage();
    }

    console.log(newCategoryItem);

    modal.hide();
    audioCategory.play();
  });

  return wrap;
}
