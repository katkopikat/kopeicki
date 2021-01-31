import createElement from '../../utils/create';
import modal from './modal';
import app from '../../app';
import { getLanguage, getSound } from '../../utils/localStorage';
import showPopover from '../popover';
import translations from '../../data/translations';
import pubsub from '../../pubsub';

const isNewNameValid = (newName, type, btnElem, inputElem) => {
  const lang = getLanguage();

  const errorMessage = {
    en: 'Please fill out all the fields',
    ru: 'Пожалуйста, заполните все поля',
    by: 'Калі ласка, запоўніце ўсе палі',
  };

  const errorExists = {
    en: 'This name already exists',
    ru: 'Такое имя уже существует',
    by: 'Такое імя ўжо існуе',
  };

  if (!newName) {
    showPopover(btnElem, errorMessage[lang], 'right');
    return false;
  }
  const listWithTralslations = [];
  const categoryList = [...app.user[type]];
  categoryList
    .map(({ name }) => name)
    .concat(['account', 'expenses', 'income'])
    .forEach((item) => {
      ['en', 'ru', 'by'].forEach((el) => listWithTralslations.push(translations[el][item] || item));
    });

  const exists = listWithTralslations.find((item) => item.toLowerCase() === newName.toLowerCase());
  if (exists) {
    showPopover(inputElem, errorExists[lang], 'bottom');
    return false;
  }
  return true;
};

export default function newCategoryModal(type) {
  const lang = getLanguage();

  const titleOptions = {
    accounts: {
      en: 'Do you have a new account?',
      ru: 'Хотите завести новый счет?',
      by: 'Хочаце завесці новы рахунак?',
    },
    expenses: {
      en: 'What else will you spend money on?',
      ru: 'На что еще будем тратить деньги?',
      by: 'На што яшчэ будзем траціць грошы?',
    },
    income: {
      en: 'Where else will you get money from?',
      ru: 'Где еще будем брать деньги?',
      by: 'Адкуль яшчэ будзем браць грошы?',
    },
  };

  const saveBtnOptions = {
    en: 'Create!',
    ru: 'Создать!',
    by: 'Стварыць!',
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
    const moneyAmount = createElement('input', 'modal-body__amount', null, ['type', 'number'], ['placeholder', '0.00']);

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
    if (isNewNameValid(newCategoryName.value, type, saveBtn, newCategoryName)) {
      const icon = wrap.querySelector('input[name="icon"]:checked').value;

      const newCategoryItem = {
        name: newCategoryName.value,
        icon,
      };

      if (type === 'accounts') {
        newCategoryItem.amount = Number(wrap.querySelector('.modal-body__amount').value);

        console.log(newCategoryItem);
        await app.addUserAccount(newCategoryItem);
        pubsub.publish('navigateTo', '/');
      } else if (type === 'expenses') {
        await app.addUserExpense(newCategoryItem);
        pubsub.publish('navigateTo', '/');
      } else {
        await app.addUserIncome(newCategoryItem);
        pubsub.publish('navigateTo', '/');
      }

      if (getSound() === 'on') {
        const audioCategory = new Audio();
        audioCategory.src = 'sounds/category.mp3';
        audioCategory.play();
      }

      modal.hide();
    }
  });

  return wrap;
}
