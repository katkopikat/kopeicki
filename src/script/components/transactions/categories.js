import createElement from '../../utils/create';
import { createModal, addTransactionModal } from '../modal';

export default function createCategoryList(list, isDraggable, modalOpts, container) {
  const listContainer = createElement('div', 'flex-list');

  list.forEach((category) => {
    const categoryName = createElement('span', '', category.name);
    const categoryIcon = createElement('i', ['fas', category.icon]);
    const categoryIconDiv = createElement('div', 'category-icon', categoryIcon);
    const categoryElem = createElement(
      'div',
      'flex-list__item',
      [categoryIconDiv, categoryName],
      ['category', category.name],
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

    const modal = createModal(addTransactionModal(category, modalOpts));

    modal.show();
  });

  container.append(listContainer);
}
