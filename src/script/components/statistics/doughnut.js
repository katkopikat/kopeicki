/* eslint-disable no-param-reassign */

import { Chart } from 'chart.js';
import moment from 'moment';
import createElement from '../../utils/create';
import app from '../../app';
import { getTheme } from '../../utils/localStorage';

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
    'btn-group btn-group-toggle',
    null,
    ['toggle', 'buttons'],
  );

  const doughnutPeriodBtnsWrapper = createElement(
    'div',
    'btn-group btn-group-toggle doughnut-years',
    null,
    ['toggle', 'buttons'],
  );

  const doughnutPeriodBtns = `
  <label class="btn btn-secondary active">
  <input type="radio" name="period" id="month" autocomplete="off" checked> Month
</label>
<label class="btn btn-secondary">
  <input type="radio" name="period" id="year" autocomplete="off"> Year
  </label>`;

  const doughnutTypeBtns = `
<label class="btn btn-secondary active">
<input type="radio" name="type" id="expenses" autocomplete="off" checked> Expense
</label>
<label class="btn btn-secondary">
<input type="radio" name="type" id="income" autocomplete="off"> Income
  </label>`;

  document.querySelector('.charts-wrapper').append(doughnutWrapperDiv);
  doughnutWrapperDiv.append(doughnutCanvas);

  doughnutWrapperDiv.append(doughnutTypeBtnsWrapper);
  doughnutWrapperDiv.append(doughnutPeriodBtnsWrapper);

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

// function calculateTotalSum() {
//   return Object.values(summaryObj).length !== 0
//     ? parseInt(Object.values(summaryObj).reduce((sum, it) => sum + it), 10) : 0;
// }

function generateChart(/* type, time */) {
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
      cutoutPercentage: 60,
      legend: {
        position: 'right',
      },
    },

  });
}

function buttonsListeners() {
  document.querySelectorAll('[name="period"]').forEach((btnPer) => {
    btnPer.addEventListener('click', () => {
      if (btnPer.checked === true) {
        period = btnPer.id;
        doughnut.destroy();
        filterTransactions();
        generateChart(typeTransaction, period);
      }
    });
  });

  document.querySelectorAll('[name="type"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.checked === true) {
        typeTransaction = btn.id;
        doughnut.destroy();
        filterTransactions();
        generateChart(typeTransaction, period);
      }
    });
  });
}

function createDoughnutContent() {
  filterTransactions();
  renderDoughnutHTML();
  buttonsListeners();
  generateChart(typeTransaction, period);
}

export default function renderDoughnutChart() {
  getHistory().then(() => createDoughnutContent());
}

document.getElementById('theme').addEventListener('click', () => {
  doughnut.destroy();
  setTimeout(generateChart, 0);
});
