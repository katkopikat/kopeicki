/* eslint-disable no-param-reassign */

import { Chart } from 'chart.js';
import moment from 'moment';
import createElement from '../../utils/create';
import app from '../../app';
import { getTheme } from '../../utils/localStorage';
import { moveToggle } from '../../utils/DOM';
import translatePage from '../settings/language';

const today = new Date();
let typeTransaction = 'expenses';
let period = 'mounth';
let summaryObj = null;
let doughnut = null;
let history;

async function getHistory() {
  const transactions = await app.api.getTransactions();
  history = [...transactions];
}

function setBGColor() {
  return getTheme() === 'light' ? 'rgba(234, 240, 247, 1)' : 'rgba(29, 32, 43, 1)';
}

function renderDoughnutHTML() {
  const doughnutWrapperDiv = createElement('div', 'wrapper-doughnut');
  const doughnutCanvas = createElement('canvas', 'doughnut-container');

  const doughnutTypeBtnsWrapper = createElement(
    'div',
    'toggle doughnut-type',
  );

  const doughnutPeriodBtnsWrapper = createElement(
    'div',
    'toggle doughnut-period',
  );

  const doughnutPeriodBtns = `
  <input type="checkbox" class="checkbox" id="doughnut-period" />
  <span data-i18n="Month">Month</span>
  <label for="doughnut-period" class="label">
    <div class="ball"></div>
  </label>
  <span data-i18n="Year">Year</span>`;

  const doughnutTypeBtns = `
  <input type="checkbox" class="checkbox" id="doughnut-type" />
  <span data-i18n="Expenses">Expenses</span>
  <label for="doughnut-type" class="label">
    <div class="ball"></div>
  </label>
  <span data-i18n="Income">Income</span>`;

  document.querySelector('.charts-wrapper').append(doughnutWrapperDiv);
  doughnutWrapperDiv.append(doughnutCanvas, doughnutPeriodBtnsWrapper, doughnutTypeBtnsWrapper);

  doughnutPeriodBtnsWrapper.insertAdjacentHTML(
    'beforeend',
    `${doughnutPeriodBtns}`,
  );
  doughnutTypeBtnsWrapper.insertAdjacentHTML(
    'beforeend',
    `${doughnutTypeBtns}`,
  );
}

function filterTransactions() {
  const filtredHistory = history.filter((transaction) => {
    const trDate = new Date(transaction.date);
    if (period === 'year') {
      const oneYearAgo = new Date().setFullYear(new Date().getFullYear() - 1);
      return moment(transaction.date).isBetween(oneYearAgo, moment.now())
             && transaction.type === typeTransaction;
    }
    return trDate.getMonth() === today.getMonth() && transaction.type === typeTransaction;
  });

  summaryObj = filtredHistory.reduce((summary, trans) => {
    if (Object.prototype.hasOwnProperty.call(summary, trans.category)) {
      summary[trans.category] += parseInt(trans.amount, 10);
    } else {
      summary[trans.category] = parseInt(trans.amount, 10);
    }
    return summary;
  },
  {});
}

function calculateTotalSum() {
  return Object.values(summaryObj).length !== 0
    ? parseInt(Object.values(summaryObj).reduce((sum, it) => sum + it), 10) : 0;
}

function generateChart() {
  const canvas = document.querySelector('.doughnut-container');
  doughnut = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: Object.keys(summaryObj).length !== 0 ? Object.keys(summaryObj) : ['You`re haven`t any transactions'],
      datasets: [{
        data: Object.values(summaryObj).length !== 0 ? Object.values(summaryObj) : [1],
        backgroundColor: [
          'rgba(243, 94, 110, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(236, 178, 18, 1)',
          'rgba(52, 62, 176, 1)',
          'rgba(47, 186, 147, 1)',
          'rgba(0, 93, 236, 1)',
          'rgba(243, 94, 110, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(236, 178, 18, 1)',
          'rgba(52, 62, 176, 1)',
          'rgba(47, 186, 147, 1)',
          'rgba(0, 93, 236, 1)',
        ],
        borderColor: setBGColor(),
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      cutoutPercentage: 50,
      title: {
        display: true,
        position: 'top',
        fontSize: 15,
        text: `Total ${typeTransaction} for the ${period} ${calculateTotalSum()} rub.`,
      },
      legend: {
        position: 'right',
      },
    },

  });
}

function buttonsTypeListeners() {
  const typeToggleDiv = document.querySelector('.toggle.doughnut-type');
  const typeToggle = document.getElementById('doughnut-type');
  const width = 24;

  const isChecked = typeTransaction === 'income';
  typeToggle.checked = isChecked;

  typeToggle.addEventListener('change', () => {
    const transition = () => {
      document.documentElement.classList.add('transition');
      window.setTimeout(() => {
        document.documentElement.classList.remove('transition');
      }, 1000);
    };

    moveToggle(typeToggleDiv, width, typeToggle.checked);
    typeTransaction = typeToggle.checked ? 'income' : 'expenses';
    doughnut.destroy();
    filterTransactions();
    console.log(typeTransaction);
    generateChart(typeTransaction, period);
    transition();
  });
}

function buttonsPeriodListeners() {
  const periodToggleDiv = document.querySelector('.toggle.doughnut-period');
  const periodToggle = document.getElementById('doughnut-period');
  const width = 24;

  const isChecked = typeTransaction === 'year';
  periodToggle.checked = isChecked;

  periodToggle.addEventListener('change', () => {
    const transition = () => {
      document.documentElement.classList.add('transition');
      window.setTimeout(() => {
        document.documentElement.classList.remove('transition');
      }, 1000);
    };

    moveToggle(periodToggleDiv, width, periodToggle.checked);
    period = periodToggle.checked ? 'year' : 'month';
    doughnut.destroy();
    filterTransactions();
    console.log(period);
    generateChart(typeTransaction, period);
    transition();
  });
}

function createDoughnutContent() {
  filterTransactions();
  renderDoughnutHTML();
  buttonsTypeListeners();
  buttonsPeriodListeners();
  generateChart(typeTransaction, period);
  translatePage();
}

export default function renderDoughnutChart() {
  getHistory().then(() => createDoughnutContent());
}

document.getElementById('theme').addEventListener('click', () => {
  doughnut.destroy();
  setTimeout(generateChart, 0);
});
