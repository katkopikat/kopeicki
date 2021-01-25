import createElement from '../../utils/create';
import app from '../../app';

export default function renderStatisticsHtml() {
  const main = document.querySelector('main');

  const row = createElement('div', 'row');
  const mainContainer = createElement('div', 'container-xxl transactions-container', row);

  main.append(mainContainer);

  const textStatistic = createElement('div', 'col-10 text-statistic-wrapper');
  const charts = createElement('div', 'col-10 charts-wrapper');
  // const table = createElement('div', 'col-5 table-wrapper');

  row.append(textStatistic);
  row.append(charts);
  // row.append(table);

  const textStatisticsObj = [
    {
      name: 'summaryAccount',
      text: 'На ваших счетах сейчас ',
    },
    {
      name: 'mostExpensesCategories',
      text: 'Большего всего вы тратите на ',
    },
    {
      name: 'monthExpenses',
      text: 'На ваших счетах сейчас ',
    },
    {
      name: 'averageMonthExpenses',
      text: 'На ваших счетах сейчас ',
    },
    {
      name: 'averageYearExpenses',
      text: 'На ваших счетах сейчас ',
    },
    {
      name: 'summaryAccount',
      text: 'На ваших счетах сейчас ',
    },
  ];

  textStatisticsObj.forEach((info) => {
    const temp = createElement('span', `${info.class}`);
    temp.innerText = info.text + app.user.currency;
    textStatistic.append(temp);
  });
}
//   const summaryAccount = createElement('span', 'summary-account-status');
//   const mostExpensesCategories = createElement('span', 'most-expenses-categ');
//   const monthExpenses = createElement('span', 'month-expenses');
//   const averageMonthExpenses = createElement('span', 'average-month-expenses');
//   const lastYearExpenses = createElement('span', 'last-year-expenses');
//   const averageYearExpenses = createElement('span', 'month-expenses');
//   const expensesAllTime = createElement('span', 'expenses-all-time');
//   const lastMonthIncome = createElement('span', 'last-month-income');
//   const averageMonthIncome = createElement('span', 'average-month-income');
//   const lastYearIncome = createElement('span', 'last-year-income');
//   const averageYearIncome = createElement('span', 'average-year-income');
//   const incomeAllTime = createElement('span', 'income-all-time');

// НА ВАШИХ СЧЕТАХ СЕЙЧАС: 117 900р
// Большего всего вы тратите на (3 категории)

// ТРАТЫ:
// ________
// В этом месяце вы потратили: +
// В среднем вы тратите в месяц: +

// В этом году вы потратили: +
// В среднем вы тратите за год: +

// Траты за всё время составили: +

// ДОХОДЫ

// Ваш доход в этом месяце:+
// В среднем ваш ежемесячный доход +

// В этом году вы заработали +
// В среднем вы зарабатываете *** в год +

// Доход за всё время составил:
