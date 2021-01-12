import createElement from '../../utils/create';
import { allAccountsCategories, accountModal } from '../../data/accounts';
import { allExpensesCategories, expenseModal } from '../../data/expenses';
import { allIncomeCategories, incomeModal } from '../../data/income';
import { dragStart, dragEnd, dragOver, dragEnter, dragLeave, dragDrop } from './dragnDrop';
import createCategoryList from './categories';

export default function displayTransactionsPage(/* options */) {
  const accountsDiv = createElement(
    'div',
    'transactions-dashboard__item accounts',
    '<h4>Accounts</h4>',
  );
  const expensesDiv = createElement(
    'div',
    'transactions-dashboard__item expenses',
    '<h4>Expenses</h4>',
  );
  const incomeDiv = createElement('div', 'transactions-dashboard__item income', '<h4>Income</h4>');

  const dashboard = createElement('div', 'col-7 transactions-dashboard', [
    accountsDiv,
    expensesDiv,
    incomeDiv,
  ]);
  const history = createElement('div', 'col-4 transactions-history');

  const row = createElement('div', 'row', [dashboard, history]);

  const mainContainer = createElement('div', 'container-xxl transactions-container', row);

  document.querySelector('main').append(mainContainer);

  createCategoryList(allAccountsCategories, false, accountModal, accountsDiv);
  createCategoryList(allExpensesCategories, true, expenseModal, expensesDiv);
  createCategoryList(allIncomeCategories, true, incomeModal, incomeDiv);

  const draggables = document.querySelectorAll('[draggable="true"]');
  const wallets = document.querySelectorAll('[draggable="false"]');

  draggables.forEach((draggable) => {
    draggable.addEventListener('dragstart', dragStart);
    draggable.addEventListener('dragend', dragEnd);
  });

  wallets.forEach((wallet) => {
    wallet.addEventListener('dragover', dragOver);
    wallet.addEventListener('dragenter', dragEnter);
    wallet.addEventListener('dragleave', dragLeave);
    wallet.addEventListener('drop', dragDrop);
  });
}
