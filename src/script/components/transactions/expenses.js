import createElement from '../../utils/create';
import { createModal, addTransactionModal } from '../modal';
import createCategoryList from './categories';

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

export default function displayExpenses() {
  const expensesContainer = createElement('div', 'flex-list');

  createCategoryList(expensesContainer, allExpenseCategories);

  expensesContainer.addEventListener('click', (e) => {
    const expense = e.target.closest('.flex-list__item');

    if (!expense) return;

    const { category } = expense.dataset;

    const expenseModal = createModal(
      addTransactionModal(category, {
        class: 'expenses-modal',
        title: 'Spent',
        saveBtn: 'Spent it!',
      }),
    );

    expenseModal.show();
  });

  document.querySelector('.expenses').append(expensesContainer);
}
