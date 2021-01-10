import createElement from '../../utils/create';
import { createModal, addExpenseModal } from '../modal';
import createCategoryList from './categories';

const allAccountsCategories = [
  {
    name: 'Bank account',
    icon: 'fa-car',
  },
  {
    name: 'Cash',
    icon: 'fa-car',
  },
];

export default function displayAccounts() {
  const accountsContainer = createElement('div', 'flex-list');

  createCategoryList(accountsContainer, allAccountsCategories);

  accountsContainer.addEventListener('click', (e) => {
    const income = e.target.closest('.flex-list__item');

    if (!income) return;

    const { category } = income.dataset;

    const incomeModal = createModal(addExpenseModal(category), 'add-income');

    incomeModal.show();
  });

  document.querySelector('.accounts').append(accountsContainer);
}
