import createElement from '../../utils/create';
import modal from './modal';
import app from '../../app';

export default function newCategoryModal(type) {
  const titleOptions = {
    accounts: 'Do you have a new account?',
    expenses: 'What else will you spend money on?',
    income: 'Where else will you get money from?',
  };

  const numOfItems = {
    accounts: 11,
    expenses: 46,
    income: 14,
  };

  document.querySelector('.modal-content').className = `modal-content ${type} new-category`;

  const wrap = createElement('div', 'content new-category');

  const title = createElement('h5', 'title', titleOptions[type]);
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

  const saveBtn = createElement('button', 'btn btn-light', 'Create!');

  [title, newCategoryName, iconsContainer, saveBtn].forEach((el) => wrap.append(el));

  if (type === 'accounts') {
    const moneyAmount = createElement(
      'span',
      'modal-body__amount',
      '0.00',
      ['role', 'textbox'],
      ['contenteditable', true],
    );
    const currency = createElement('span', 'modal-body__currency', 'rub');

    [moneyAmount, currency].forEach((el) => wrap.insertBefore(el, iconsContainer));
  }

  saveBtn.addEventListener('click', async () => {
    const icon = wrap.querySelector('input[name="icon"]:checked').value;

    const newCategoryItem = {
      name: newCategoryName.value,
      icon,
    };

    if (type === 'accounts') {
      newCategoryItem.amount = wrap.querySelector('.modal-body__amount').innerText;
      newCategoryItem.currency = wrap.querySelector('.modal-body__currency').innerText;

      await app.addUserAccount(newCategoryItem);
      document.querySelector('main').innerHTML = '';
      app.renderTransactionsPage();
    } else if (type === 'expenses') {
      await app.addUserExpense(newCategoryItem);
      document.querySelector('main').innerHTML = '';
      app.renderTransactionsPage();
    } else {
      await app.addUserIncome(newCategoryItem);
      document.querySelector('main').innerHTML = '';
      app.renderTransactionsPage();
    }

    console.log(newCategoryItem);

    modal.hide();
  });

  return wrap;
}
