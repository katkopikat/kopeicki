import createElement from '../utils/create';

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

const container = document.querySelector('.container-sm');

export default function createExpensesList() {
  allExpenseCategories.forEach((category) => {
    const categoryName = createElement('span', '', category.name);
    const categoryIcon = createElement('i', ['fas', category.icon]);
    const categoryElem = createElement('div', 'expenses-list__item', [categoryIcon, categoryName]);
    container.append(categoryElem);
  });
}
