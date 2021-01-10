import createElement from '../../utils/create';

export default function createCategoryList(container, list) {
  list.forEach((category) => {
    const categoryName = createElement('span', '', category.name);
    const categoryIcon = createElement('i', ['fas', category.icon]);
    const categoryIconDiv = createElement('div', 'category-icon', categoryIcon);
    const categoryElem = createElement(
      'div',
      'flex-list__item',
      [categoryIconDiv, categoryName],
      ['category', category.name],
    );

    container.append(categoryElem);
  });

  const addCategoryBtn = createElement(
    'div',
    'flex-list__item add-category',
    '<div class="add"></div> <span>Add category</span>',
  );

  container.append(addCategoryBtn);
}
