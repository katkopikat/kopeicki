import createElement from '../../utils/create';
import app from '../../app';
import translatePage from '../settings/language';

export default function renderTextStatistics() {
  const main = document.querySelector('main');
  const row = createElement('div', 'row');
  const mainContainer = createElement('div', 'container-xxl transactions-container', row);
  const textStatistic = createElement('div', 'row text-statistic-wrapper');
  const charts = createElement('div', 'col-10 charts-wrapper');

  const accountTextWrapper = createElement(
    'div',
    'col-10 account-statistic-wrapper statistic-container',
    '<h1 data-i18n="accounts" class="statistic-h">Accounts</h1>',
  );

  const expensesTextWrapper = createElement(
    'div',
    'col-5 expenses-statistic-wrapper statistic-container',
    '<h1 data-i18n="expenses" class="statistic-h">Expenses</h1>',
  );

  const incomeTextWrapper = createElement(
    'div',
    'col-5 income-statistic-wrapper statistic-container',
    '<h1 data-i18n="incomes" class="statistic-h">Incomes</h1>',
  );

  main.append(mainContainer);
  row.append(textStatistic, charts);
  textStatistic.append(accountTextWrapper, expensesTextWrapper, incomeTextWrapper);

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
