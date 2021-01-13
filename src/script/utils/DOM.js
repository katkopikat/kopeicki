import createElement from './create';
import allAccountsCategories from '../data/accounts';
import allExpensesCategories from '../data/expenses';
import allIncomeCategories from '../data/income';

export function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

export function createSelect(selected, type) {
  let list;

  switch (type) {
    case 'expenses':
      list = [...allExpensesCategories];
      break;
    case 'income':
      list = [...allIncomeCategories];
      break;
    default:
      list = [...allAccountsCategories];
  }

  const names = list.map(({ name }) => name);

  const selectEl = createElement('select');

  names.forEach((name) => {
    if (name === selected) {
      selectEl.insertAdjacentHTML(
        'afterbegin',
        `<option value="${name}" selected>${name.toLowerCase()}</option>`,
      );
    } else {
      selectEl.insertAdjacentHTML(
        'afterbegin',
        `<option value="${name}">${name.toLowerCase()}</option>`,
      );
    }
  });

  return selectEl;
}
