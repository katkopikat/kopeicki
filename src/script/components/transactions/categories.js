import createElement from '../../utils/create';
import allAccountsCategories from '../../data/accounts';
import allExpensesCategories from '../../data/expenses';
import allIncomeCategories from '../../data/income';
import modal from '../modals/modal';
import transactionModal from '../modals/transactionModal';
import newCategoryModal from '../modals/newCategoryModal';

export default function createCategoryList(group, container) {
  let list;

  switch (group) {
    case 'accounts':
      list = [...allAccountsCategories];
      break;
    case 'expenses':
      list = [...allExpensesCategories];
      break;
    case 'income':
      list = [...allIncomeCategories];
      break;
    default:
      break;
  }

  const isDraggable = !!(group !== 'accounts');

  const listContainer = createElement('div', 'flex-list');

  list.forEach((category) => {
    const categoryName = createElement('span', '', category.name, ['i18n', category.name]);
    const imgSrc = `background-image: url(${category.icon});`;
    const categoryIcon = createElement('div', 'icon-svg', null, ['style', imgSrc]);
    const categoryIconDiv = createElement('div', 'category-icon', categoryIcon);

    const categoryElem = createElement(
      'div',
      'flex-list__item',
      [categoryIconDiv, categoryName],
      ['category', category.name],
      ['group', group],
      ['draggable', isDraggable],
    );

    listContainer.append(categoryElem);
  });

  const addCategoryBtn = createElement(
    'div',
    'flex-list__item add-category',
    '<div class="add"></div><span data-i18n="new">New category</span>',
    ['group', group],
  );

  listContainer.append(addCategoryBtn);

  listContainer.addEventListener('click', (e) => {
    const categoryItem = e.target.closest('.flex-list__item');

    if (!categoryItem) return;

    const type = categoryItem.dataset.group;

    if (!categoryItem.classList.contains('add-category')) {
      const { category } = categoryItem.dataset;

      modal.setContent(transactionModal({ type, to: category }));
    } else {
      modal.setContent(newCategoryModal(type));
    }

    modal.show();
  });

  container.append(listContainer);

  /* ------------ HOT KEYS ---------------
      SHIFT + E --> New expense
      SHIFT + I --> New income
      SHIFT + A --> New account
      SHIFT + S --> Open settings page
      SHIFT + R --> Edit categories (remove catrgories)
  */

  let shiftIsPressed = false;
  window.addEventListener('keydown', (e) => {
    if (e.keyCode === 16) {
      shiftIsPressed = true;
      e.preventDefault();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.keyCode === 16) {
      shiftIsPressed = false;
      e.preventDefault();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (shiftIsPressed && e.keyCode === 69) {
      console.log('Shift + E => Open new expense modal!');
      e.preventDefault();
      modal.setContent(transactionModal('expenses', ''));
      modal.show();
    }
    if (shiftIsPressed && e.keyCode === 73) {
      console.log('Shift + I => Open mew income modal!');
      e.preventDefault();
      modal.setContent(transactionModal('income', ''));
      modal.show();
    }
    if (shiftIsPressed && e.keyCode === 65) {
      console.log('Shift + A => Open mew account modal!');
      e.preventDefault();
      modal.setContent(transactionModal('account', ''));
      modal.show();
    }
    if (shiftIsPressed && e.keyCode === 83) {
      e.preventDefault();
      console.log('Shift + S => Open setings page!');
    }
    if (shiftIsPressed && e.keyCode === 82) {
      e.preventDefault();
      console.log('Shift + R => Edit categories!');
    }
  });
}
