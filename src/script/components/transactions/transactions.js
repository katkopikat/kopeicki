import createElement from '../../utils/create';
import {
  dragStart, dragEnd, dragOver, dragEnter, dragLeave, dragDrop,
} from './dragnDrop';
import createCategoryList from './categories';
import renderHistory from './history';
import translatePage from '../settings/language';
import app from '../../app';
import pubsub from '../../pubsub';
import { formatNumber } from '../../utils/helpers';

function preloader() {
  const preloaderEl = document.getElementById('preloader');
  preloaderEl.classList.toggle('visible');
}

export default async function renderTransactionsPage() {
  document.querySelector('main').innerHTML = '';

  if (app.user) {
    preloader();

    await app.getTransactions();

    const accountsDiv = createElement(
      'div',
      'transactions-dashboard__item accounts',
      `<div class="item__header">
      <h4 data-i18n="accounts">Accounts</h4>
      <div>
        <p data-i18n="rest">Rest:</p>
        <h5>${formatNumber(app.getAccountsTotal())}</h5>
      </div>
      </div>`,
    );
    const expensesDiv = createElement(
      'div',
      'transactions-dashboard__item expenses',
      `<div class="item__header">
      <h4 data-i18n="expenses">Expenses</h4>
      <div>
        <p data-i18n="this month">This month:</p>
        <h5>-${formatNumber(app.transactionsSummary.expensesTotal)}</h5>
      </div>
      </div>`,
    );
    const incomeDiv = createElement(
      'div',
      'transactions-dashboard__item income',
      `<div class="item__header">
      <h4 data-i18n="income">Income</h4>
      <div>
        <p data-i18n="this month">This month:</p>
        <h5>+${formatNumber(app.transactionsSummary.incomeTotal)}</h5>
      </div>
      </div>`,
    );

    const dashboard = createElement('div', 'col-8 transactions-dashboard', [accountsDiv, expensesDiv, incomeDiv]);
    const history = createElement('div', 'col-4 transactions-history');

    const row = createElement('div', 'row', [dashboard, history]);

    const mainContainer = createElement('div', 'container-xxl transactions-container', row);

    document.querySelector('main').append(mainContainer);

    createCategoryList('accounts', accountsDiv);
    createCategoryList('expenses', expensesDiv);
    createCategoryList('income', incomeDiv);

    renderHistory().then(() => {
      translatePage();
    });

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
  preloader();
}

pubsub.subscribe('renderTransactionsPage', renderTransactionsPage);
