import createElement from '../../utils/create';
import displayAccounts from './accounts';
import displayExpenses from './expenses';
import displayIncome from './income';

export default function displayTransactionsPage(/* options */) {
  const accounts = createElement(
    'div',
    'transactions-dashboard__item accounts',
    '<h4>Accounts</h4>',
  );
  const expenses = createElement(
    'div',
    'transactions-dashboard__item expenses',
    '<h4>Expenses</h4>',
  );
  const income = createElement('div', 'transactions-dashboard__item income', '<h4>Income</h4>');

  const dashboard = createElement('div', 'col-sm transactions-dashboard', [
    accounts,
    expenses,
    income,
  ]);
  const history = createElement('div', 'col-sm transactions-history');

  const row = createElement('div', 'row', [dashboard, history]);

  const mainContainer = createElement('div', 'container-xxl transactions-container', row);

  document.querySelector('main').append(mainContainer);

  displayAccounts();
  displayExpenses();
  displayIncome();
}
