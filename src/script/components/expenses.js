import createElement from '../utils/create';
import { createModal, addExpenseModal } from './modal';

const allExpenseCategories = [
  {
    name: 'Groceries',
    icon: 'fa-car',
  },
  {
    name: 'Entertainment',
    icon: 'fa-car',
  },
  {
    name: 'Eating out',
    icon: 'fa-car',
  },
  {
    name: 'Shopping',
    icon: 'fa-car',
  },
  {
    name: 'Transport',
    icon: 'fa-car',
  },
  {
    name: 'Home',
    icon: 'fa-car',
  },
  {
    name: 'Services',
    icon: 'fa-car',
  },
  {
    name: 'Car',
    icon: 'fa-car',
  },
  {
    name: 'Travel',
    icon: 'fa-car',
  },
  {
    name: 'Healthcare',
    icon: 'fa-car',
  },
  {
    name: 'Beauty',
    icon: 'fa-car',
  },
  {
    name: 'Education',
    icon: 'fa-car',
  },
  {
    name: 'Gifts',
    icon: 'fa-car',
  },
  {
    name: 'Other',
    icon: 'fa-car',
  },
];

function createExpensesList(container) {
  allExpenseCategories.forEach((category) => {
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
}

export default function expenses() {
  const expensesContainer = createElement('div', ['flex-list']);

  document.querySelector('.expenses').append(expensesContainer);

  createExpensesList(expensesContainer);

  expensesContainer.addEventListener('click', (e) => {
    const expense = e.target.closest('.flex-list__item');

    if (!expense) return;

    const { category } = expense.dataset;

    const expenseModal = createModal(addExpenseModal(category), 'add-expense');

    expenseModal.show();
  });
}
