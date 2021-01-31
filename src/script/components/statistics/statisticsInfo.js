import createElement from '../../utils/create';
import app from '../../app';
import translatePage from '../settings/language';

export default function renderTextStatistics() {
  const main = document.querySelector('main');

  const mainContainer = createElement(
    'div',
    'container-xxl statistics-container',
    `<div class="row"></div>
    <div class="row"></div>
    <div class="row"></div>`,
  );

  const firstRow = mainContainer.querySelector('.row:first-child');
  const secondRow = mainContainer.querySelector('.row:nth-child(2)');
  const thirdRow = mainContainer.querySelector('.row:last-child');

  const charts = createElement('div', 'col charts-wrapper');

  const accountTextWrapper = createElement(
    'div',
    'col account-statistic-wrapper statistic-container',
    '<h1 data-i18n="accounts" class="statistic-h">Accounts</h1>',
  );

  const expensesTextWrapper = createElement(
    'div',
    'col expenses-statistic-wrapper statistic-container',
    '<h1 data-i18n="expenses" class="statistic-h">Expenses</h1>',
  );

  const incomeTextWrapper = createElement(
    'div',
    'col income-statistic-wrapper statistic-container',
    '<h1 data-i18n="incomes" class="statistic-h">Incomes</h1>',
  );

  firstRow.append(accountTextWrapper);
  secondRow.append(expensesTextWrapper, incomeTextWrapper);
  thirdRow.append(charts);

  main.append(mainContainer);

  const infoStatistics = [
    {
      name: 'summaryAccount',
      class: 'info_accounts',
      data: '1000',
    },
    {
      name: 'mostExpensesCategories',
      class: 'info_expenses',
      data: '1000',
    },
    {
      name: 'monthExpenses',
      class: 'info_expenses',
      data: '1000',
    },
    {
      name: 'averageMonthExpenses',
      class: 'info_expenses',
      data: '1000',
    },
    {
      name: 'averageYearExpenses',
      class: 'info_expenses',
      data: '1000',
    },
    {
      name: 'allTimeExpenses',
      class: 'info_expenses',
      data: '1000',
    },
    {
      name: 'monthIncome',
      class: 'info_income',
      data: '1000',
    },
    {
      name: 'averageMonthIncome',
      class: 'info_income',
      data: '1000',
    },
    {
      name: 'yearIncome',
      class: 'info_income',
      data: '1000',
    },
    {
      name: 'averageYearIncome',
      class: 'info_income',
      data: '1000',
    },
    {
      name: 'allTineIncome',
      class: 'info_income',
      data: '1000',
    },
  ];

  function renderInfo() {
    infoStatistics.forEach((info, i) => {
      const textWrapper = createElement(
        'p',
        'statistic-text',
        `<span data-i18n="stat${i}"></span>
        <span class="${info.class}">${info.data} ${app.user.currency.toUpperCase()}.</span>`,
      );

      if (info.class === 'info_accounts') {
        accountTextWrapper.append(textWrapper);
      } else if (info.class === 'info_expenses') {
        expensesTextWrapper.append(textWrapper);
      } else {
        incomeTextWrapper.append(textWrapper);
      }
    });
  }
  renderInfo();
  translatePage();

  /* Text translation when the language changes.
     Whaiting rendering menu and change language on the localStorage. */
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.select__list').addEventListener('click', () => {
      document.querySelectorAll('.statistic-text').forEach((el) => el.remove());
      setTimeout(renderInfo, 0);
    });
  });
}
