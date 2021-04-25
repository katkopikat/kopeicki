import createElement from '../../utils/create';
import app from '../../app';
import translatePage from '../settings/language';
import { formatNumber } from '../../utils/helpers';
import translations from '../../data/translations';
import { getLanguage } from '../../utils/localStorage';

export default function renderTextStatistics(stat) {
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
  const lang = getLanguage();
  const dictionary = (Object.keys(translations[lang]));
  const thisYear = String(new Date().getFullYear());
  const { mostSpend } = stat;
  if (!mostSpend.length) {
    mostSpend.push('nothing yet');
  }
  const infoStatistics = [
    {
      name: 'summaryAccount',
      class: 'info_accounts',
      data: formatNumber(app.getAccountsTotal()),
    },
    {
      name: 'mostExpensesCategories',
      class: 'info_expenses',
      data: (mostSpend.map((it) => (dictionary.includes(it) ? translations[lang][it] : it))).join(', '),
    },
    {
      name: 'monthExpenses',
      class: 'info_expenses',
      data: formatNumber(app.transactionsSummary.expensesTotal),
    },
    {
      name: 'averageMonthExpenses',
      class: 'info_expenses',
      data: formatNumber(stat.avgMonth?.expenses || 0), // '1000',
    },
    {
      name: 'averageYearExpenses',
      class: 'info_expenses',
      data: formatNumber(stat.perYear?.expenses?.avgYear || 0),
    },
    {
      name: 'allTimeExpenses',
      class: 'info_expenses',
      data: formatNumber(stat.perYear?.expenses?.total || 0),
    },
    {
      name: 'monthIncome',
      class: 'info_income',
      data: formatNumber(app.transactionsSummary.incomeTotal),
    },
    {
      name: 'averageMonthIncome',
      class: 'info_income',
      data: formatNumber(stat.avgMonth?.income || 0),
    },
    {
      name: 'yearIncome',
      class: 'info_income',
      data: formatNumber(stat.perYear?.income?.years[thisYear] || 0),
    },
    {
      name: 'averageYearIncome',
      class: 'info_income',
      data: formatNumber(stat.perYear?.income?.avgYear || 0),
    },
    {
      name: 'allTimeIncome',
      class: 'info_income',
      data: formatNumber(stat.perYear?.income?.total || 0),
    },
  ];

  function renderInfo() {
    infoStatistics.forEach((info, i) => {
      const textWrapper = createElement(
        'p',
        'statistic-text',
        `<span data-i18n="stat${i}"></span>
        <span class="${info.class}">${info.data}
        ${info.name === 'mostExpensesCategories' ? '' : app.user.currency.toUpperCase()}</span>`,
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
}
