import createElement from '../../utils/create';
import modal from '../modals/modal';
import transactionModal from '../modals/transactionModal';
import newCategoryModal from '../modals/newCategoryModal';
import app from '../../app';

export default function createCategoryList(group, container) {
  const txsSummary = app.transactionsSummary;
  let list;

  switch (group) {
    case 'accounts':
      list = [...app.user.accounts];
      break;
    case 'expenses':
      list = [...app.user.expenses];
      break;
    case 'income':
      list = [...app.user.income];
      break;
    default:
      break;
  }

  const isDraggable = group !== 'accounts';

  const listContainer = createElement('div', 'flex-list');

  list.forEach((category) => {
    const categoryAmmount = createElement('span', 'category-ammount', null, ['category', category.name]);
    const categoryName = createElement('span', '', category.name, ['i18n', category.name]);
    const imgSrc = `background-image: url(${category.icon});`;
    const categoryIcon = createElement('div', 'icon-svg', null, ['style', imgSrc]);
    const categoryIconDiv = createElement('div', 'category-icon', categoryIcon);

    // categoryAmmount.innerHTML = '1000';
    categoryAmmount.textContent = Math.round(
      txsSummary[group]?.get(category.name) || category.amount || 0,
    );

    const categoryElem = createElement(
      'div',
      'flex-list__item',
      [categoryIconDiv, categoryName, categoryAmmount],
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
      Alt + E --> New expense
      Alt + I --> New income
      Alt + A --> New account
      Alt + S --> Open settings page
      Alt + R --> Edit categories (remove catrgories)
  */

  let altIsPressed = false;
  window.addEventListener('keydown', (e) => {
    if (e.keyCode === 18) {
      altIsPressed = true;
      e.preventDefault();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.keyCode === 18) {
      altIsPressed = false;
      e.preventDefault();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (altIsPressed && e.keyCode === 69) {
      console.log('Alt + E => Open new expense modal!');
      e.preventDefault();
      modal.setContent(transactionModal('expenses', ''));
      modal.show();
    }
    // if (altIsPressed && e.keyCode === 73) {
    //   console.log('Alt + I => Open mew income modal!');
    //   e.preventDefault();
    //   modal.setContent(transactionModal('income', ''));
    //   modal.show();
    // }
    if (altIsPressed && e.keyCode === 65) {
      console.log('Alt + A => Open mew account modal!');
      e.preventDefault();
      modal.setContent(transactionModal('account', ''));
      modal.show();
    }
    if (altIsPressed && e.keyCode === 83) {
      e.preventDefault();
      console.log('Alt + S => Open setings page!');
    }
    if (altIsPressed && e.keyCode === 82) {
      e.preventDefault();
      console.log('Alt + R => Edit categories!');
    }
  });
}
