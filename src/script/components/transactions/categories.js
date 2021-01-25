import createElement from '../../utils/create';
import modal from '../modals/modal';
import transactionModal from '../modals/transactionModal';
import accountModal from '../modals/accountModal';
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

    if (categoryItem.classList.contains('add-category')) {
      modal.setContent(newCategoryModal(type));
    } else {
      const { category } = categoryItem.dataset;

      if (categoryItem.dataset.group === 'accounts') {
        modal.setContent(accountModal({ type, from: category }));
      } else {
        modal.setContent(transactionModal({ type, to: category }));
      }
    }

    modal.show();
  });

  container.append(listContainer);

  /* ------------ HOT KEYS ---------------
      Alt + E --> New expense
      Alt + I --> New income
      Alt + A --> New account
  */
  let keysPushead = [];

  window.addEventListener('keydown', (e) => {
    keysPushead.push(e.target);
    if (keysPushead.length === 2) {
      if (e.altKey && e.keyCode === 69) {
        console.log('Alt + E => Open new expense modal!');
        e.preventDefault();
        // modal.setContent(transactionModal('expenses',''));
        // modal.show();
      }
      if (e.altKey && e.keyCode === 73) {
        console.log('Alt + I => Open new income modal!');
        e.preventDefault();
        // modal.setContent(transactionModal('income', ''));
        // modal.show();
      }
      if (e.altKey && e.keyCode === 65) {
        console.log('Alt + A => Create new account!');
        e.preventDefault();
        // modal.setContent(newCategoryModal('account'));
        // modal.show();
      }
      keysPushead = [];
    }
  });
}
