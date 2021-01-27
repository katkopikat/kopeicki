import createElement from '../../utils/create';
import app from '../../app';
import { getLanguage } from '../../utils/localStorage';
import translatePage from '../settings/language';

export default function renderStatisticsHtml() {
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
      text: {
        ru: 'На ваших счетах сейчас ',
        en: 'On your accounts now ',
        be: 'На вашых рахунках зараз ',
      },
    },
    {
      name: 'mostExpensesCategories',
      class: 'info_expenses',
      data: '1000',
      text: {
        ru: 'Большего всего вы тратите на ',
        en: 'The most you spend on ',
        be: 'Большага за ўсё вы марнуеце на ',
      },
    },
    {
      name: 'monthExpenses',
      class: 'info_expenses',
      data: '1000',
      text: {
        ru: 'В этом месяце вы протратили ',
        en: 'This month you\'ve spent ',
        be: 'У гэтым месяцы вы пратрацілі ',
      },
    },
    {
      name: 'averageMonthExpenses',
      class: 'info_expenses',
      data: '1000',
      text: {
        ru: 'В среднем, вы тратите в месяц ',
        en: 'On average, you spend per month ',
        be: 'У сярэднім вы марнуеце у месяц ',
      },
    },
    {
      name: 'averageYearExpenses',
      class: 'info_expenses',
      data: '1000',
      text: {
        ru: 'В среднем, ваши траты за год ',
        en: 'On average, your expenses for the year ',
        be: 'У сярэднім, вашы выдаткі за год ',
      },
    },
    {
      name: 'allTimeExpenses',
      class: 'info_expenses',
      data: '1000',
      text: {
        ru: 'За всё время ведения расходов вы потратили ',
        en: 'For all the time you spent managing expenses, you spent ',
        be: 'За ўвесь час вядзення выдаткаў вы патрацілі ',
      },
    },
    {
      name: 'monthIncome',
      class: 'info_income',
      data: '1000',
      text: {
        ru: 'В текущем месяце ваш доход составил ',
        en: 'In the current month, your income was ',
        be: 'У бягучым месяцы ваш даход склаў ',
      },
    },
    {
      name: 'averageMonthIncome',
      class: 'info_income',
      data: '1000',
      text: {
        ru: 'В среднем, в месяц вы зарабатываете ',
        en: 'On average, per month you earn ',
        be: 'У сярэднім, у месяц вы зарабляеце ',
      },
    },
    {
      name: 'yearIncome',
      class: 'info_income',
      data: '1000',
      text: {
        ru: 'В этом году ваш доход ',
        en: 'This year, your income is ',
        be: 'У гэтым годзе ваш даход ',
      },
    },
    {
      name: 'averageYearIncome',
      class: 'info_income',
      data: '1000',
      text: {
        ru: 'В среднем, в год вы зарабатываете ',
        en: 'On average, per year you earn ',
        be: 'У сярэднім, у год вы зарабляеце ',
      },
    },
    {
      name: 'allTineIncome',
      class: 'info_income',
      data: '1000',
      text: {
        ru: 'За всё время ведения доходов вы заработали ',
        en: 'For all the time of maintaining income, you have earned ',
        be: 'За ўвесь час вядзення даходаў вы зарабілі ',
      },
    },
  ];

  function renderInfo() {
    infoStatistics.forEach((info) => {
      const textWrapper = createElement('span', 'statistic-text');
      textWrapper.innerHTML = `${info.text[getLanguage()]}<span class="${info.class}">${info.data} ${app.user.currency.toUpperCase()}.</span><br>`;

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
  setTimeout(document.querySelector('.select__list').addEventListener('click', () => {
    document.querySelectorAll('.statistic-text').forEach((el) => el.remove());
    setTimeout(renderInfo, 0);
  }), 0);
}
