import createElement from '../../utils/create';
import { dragStart, dragEnd, dragOver, dragEnter, dragLeave, dragDrop } from './dragnDrop';
import createCategoryList from './categories';

export default function renderTransactionsPage(/* options */) {
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

  createCategoryList('accounts', accountsDiv);
  createCategoryList('expenses', expensesDiv);
  createCategoryList('income', incomeDiv);

  const draggables = document.querySelectorAll('[draggable="true"]');
  const accounts = document.querySelectorAll('[draggable="false"]');

  draggables.forEach((draggable) => {
    draggable.addEventListener('dragstart', dragStart);
    draggable.addEventListener('dragend', dragEnd);
  });

  accounts.forEach((account) => {
    account.addEventListener('dragover', dragOver);
    account.addEventListener('dragenter', dragEnter);
    account.addEventListener('dragleave', dragLeave);
    account.addEventListener('drop', dragDrop);
  });
}
