import createElement from '../../utils/create';
import allAccountsCategories from '../../data/accounts';
import allExpensesCategories from '../../data/expenses';
import allIncomeCategories from '../../data/income';
import { modal, transactionModal } from '../modal';

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
    const categoryName = createElement('span', '', category.name);
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
    '<div class="add"></div> <span>Add category</span>',
  );

  listContainer.append(addCategoryBtn);

  listContainer.addEventListener('click', (e) => {
    const categoryItem = e.target.closest('.flex-list__item');

    if (!categoryItem) return;

    const { category } = categoryItem.dataset;
    const type = categoryItem.dataset.group;

    modal.setContent(transactionModal({ type, to: category }));
    modal.show();
  });

  container.append(listContainer);
}
