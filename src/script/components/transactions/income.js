import createElement from '../../utils/create';
import { createModal, addExpenseModal } from '../modal';
import createCategoryList from './categories';

const allIncomeCategories = [
  {
    name: 'Salary',
    icon: 'fa-car',
  },
  {
    name: 'Freelance',
    icon: 'fa-car',
  },
  {
    name: 'Other',
    icon: 'fa-car',
  },
];

export default function displayIncome() {
  const incomeContainer = createElement('div', 'flex-list');

  createCategoryList(incomeContainer, allIncomeCategories);

  incomeContainer.addEventListener('click', (e) => {
    const income = e.target.closest('.flex-list__item');

    if (!income) return;

    const { category } = income.dataset;

    const incomeModal = createModal(addExpenseModal(category), 'add-income');

    incomeModal.show();
  });

  document.querySelector('.income').append(incomeContainer);
}
