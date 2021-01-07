import createElement from '../utils/create';
import { createModal, addExpenseModal } from './modal';

const allExpenseCategories = [
  {
    name: 'Entertainment',
    icon: 'fa-car',
  },
  {
    name: 'Food & Dining',
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
    name: 'Bills & Fees',
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
    name: 'Personal Care',
    icon: 'fa-car',
  },
  {
    name: 'Education',
    icon: 'fa-car',
  },
  {
    name: 'Gifts & Donations',
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
    const categoryElem = createElement(
      'div',
      'expenses-list__item',
      [categoryIcon, categoryName],
      ['category', category.name],
    );

    container.append(categoryElem);
  });
}

export default function expenses() {
  const expensesContainer = createElement('div', ['container-sm', 'expenses-list']);

  document.querySelector('main').append(expensesContainer);

  createExpensesList(expensesContainer);

  expensesContainer.addEventListener('click', (e) => {
    const expense = e.target.closest('.expenses-list__item');

    if (!expense) return;

    const { category } = expense.dataset;

    const expenseModal = createModal(addExpenseModal(category), 'add-expense');

    expenseModal.show();
  });
}
