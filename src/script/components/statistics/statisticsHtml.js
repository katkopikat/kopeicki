import createElement from '../../utils/create';
import app from '../../app';

export default function renderStatisticsHtml() {
  const main = document.querySelector('main');

  const row = createElement('div', 'row');
  const mainContainer = createElement('div', 'container-xxl transactions-container', row);

  const textStatistic = createElement('div', 'row text-statistic-wrapper');
  const charts = createElement('div', 'col-10 charts-wrapper');

  const accountTextWrapper = createElement(
    'div',
    'col-10 account-statistic-wrapper statistic-container',
    '<h1 data-i18n="Account" class="statistic-h">Account</h1>',
  );

  const expensesTextWrapper = createElement(
    'div',
    'col-5 expenses-statistic-wrapper statistic-container',
    '<h1 data-i18n="Expenses" class="statistic-h">Expenses</h1>',
  );

  const incomeTextWrapper = createElement(
    'div',
    'col-5 income-statistic-wrapper statistic-container',
    '<h1 data-i18n="Income" class="statistic-h">Income</h1>',
  );

  main.append(mainContainer);
  row.append(textStatistic, charts);
  textStatistic.append(accountTextWrapper, expensesTextWrapper, incomeTextWrapper);

  const textStatisticsObj = [
    {
      name: 'summaryAccount',
      class: 'info_accounts',
      data: '1000',
      text: 'На ваших счетах сейчас ',
    },
    {
      name: 'mostExpensesCategories',
      class: 'info_expenses',
      data: '1000',
      text: 'Большего всего вы тратите на ',
    },
    {
      name: 'monthExpenses',
      class: 'info_expenses',
      data: '1000',
      text: 'В этом месяце вы протратили  ',
    },
    {
      name: 'averageMonthExpenses',
      class: 'info_expenses',
      data: '1000',
      text: 'В среднем, вы тратите в месяц ',
    },
    {
      name: 'averageYearExpenses',
      class: 'info_expenses',
      data: '1000',
      text: 'В среднем, ваши траты за год ',
    },
    {
      name: 'allTimeExpenses',
      class: 'info_expenses',
      data: '1000',
      text: 'За всё время ведения расходов вы потратили ',
    },
    {
      name: 'monthIncome',
      class: 'info_income',
      data: '1000',
      text: 'В текущем месяце ваш доход составил ',
    },
    {
      name: 'averageMonthIncome',
      class: 'info_income',
      data: '1000',
      text: 'В среднем, в месяц вы зарабатываете',
    },
    {
      name: 'yearIncome',
      class: 'info_income',
      data: '1000',
      text: 'В этом году ваш доход  ',
    },
    {
      name: 'averageYearIncome',
      class: 'info_income',
      data: '1000',
      text: 'В среднем, в год вы зарабатываете ',
    },
    {
      name: 'allTineIncome',
      class: 'info_income',
      data: '1000',
      text: 'За всё время ведения доходов вы заработали ',
    },
  ];

  textStatisticsObj.forEach((info) => {
    const textWrapper = createElement('span', 'statistic-text');
    textWrapper.innerHTML = `${info.text} <span class="${info.class}">${info.data} ${app.user.currency.toUpperCase()}.</span><br>`;

    if (info.class === 'info_accounts') {
      accountTextWrapper.append(textWrapper);
    } else if (info.class === 'info_expenses') {
      expensesTextWrapper.append(textWrapper);
    } else {
      incomeTextWrapper.append(textWrapper);
    }
  });
}
