/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
import { Chart } from 'chart.js';
import createElement from '../../utils/create';
import history from '../../helpers/history_transactions';

let barChart = null;
let typeTransaction = 'expense';
const monthRU = ['янв', 'фев', 'март', 'апр', 'май', 'июн', 'июл', 'авг', 'сент', 'окт', 'нояб', 'дек'];

let choosenYear = new Date().getFullYear();
const yearsList = [];
let summaryObj = {};

function renderBarHTML() {
  const barWrapperDiv = createElement('div', 'bar-wrapper');
  const barCanvas = createElement('canvas', 'bar-container');
  const barTypeBtnsWrapper = createElement(
    'div',
    'btn-group btn-group-toggle',
    null,
    ['toggle', 'buttons'],
  );

  const barYearsBtnsWrapper = createElement(
    'div',
    'btn-group btn-group-toggle bar-years',
    null,
    ['toggle', 'buttons'],
  );

  const barTypeBtns = `
  <label class="btn btn-secondary active">
    <input type="radio" name="type-tr" id="expense" autocomplete="off" checked> Expense
  </label>
  <label class="btn btn-secondary">
    <input type="radio" name="type-tr" id="income" autocomplete="off"> Income
  </label>`;

  document.querySelector('.charts-wrapper').append(barWrapperDiv);
  barWrapperDiv.append(barCanvas);
  barWrapperDiv.append(barYearsBtnsWrapper);
  barWrapperDiv.append(barTypeBtnsWrapper);
  barTypeBtnsWrapper.insertAdjacentHTML(
    'beforeend',
    `${barTypeBtns}
  `,
  );
}

function setBarColor() {
  return new Array(12).fill(typeTransaction === 'expense' ? 'rgba(50, 124, 235, 1)' : 'rgba(75, 192, 192, 1)');
}

function countYears() {
  history.forEach((trans) => {
    const temp = (new Date(trans.date)).getFullYear();
    if (!yearsList.includes(temp)) {
      yearsList.push(temp);
    }
  });
}

function createYearsBtns() {
  const yearsBtnsContainer = document.querySelector('.bar-years');
  yearsList.sort((a, b) => b - a)
    .forEach((year, i) => {
      const checkedParam = i === 0 ? 'checked' : '';
      const activeParam = i === 0 ? 'active' : '';
      yearsBtnsContainer.insertAdjacentHTML(
        'beforeend',
        `
    <label class="btn btn-secondary ${activeParam}">
    <input type="radio" name="year" id="${year}" autocomplete="off" ${checkedParam}> ${year}
  </label>
  `,
      );
    });
}

function clearObject() {
  summaryObj = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
  };
}

function filterTransaction() {
  clearObject();

  const filtredHistory = history.filter((transaction) => {
    const trYear = new Date(transaction.date).getFullYear();
    // eslint-disable-next-line eqeqeq
    return transaction.type === typeTransaction && trYear == choosenYear;
  });

  summaryObj = filtredHistory.reduce((summary, trans) => {
    const trMonth = (new Date(trans.date)).getMonth();
    if (Object.prototype.hasOwnProperty.call(summary, trMonth)) {
      summary[trMonth] += parseFloat(trans.amount);
    } else {
      summary[trMonth] = parseFloat(trans.amount);
    }
    return summary;
  },
  summaryObj);
}

function buttonsListeners() {
  document.querySelectorAll('[name="year"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.checked === true) {
        choosenYear = btn.id;
        barChart.destroy();
        filterTransaction();
        generateBar();
      }
    });
  });

  document.querySelectorAll('[name="type-tr"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.checked === true) {
        typeTransaction = btn.id;
        barChart.destroy();
        filterTransaction();
        setBarColor();
        generateBar();
      }
    });
  });
}


function generateBar() {
  const barContainer = document.querySelector('.bar-container');
  barChart = new Chart(barContainer, {
    type: 'bar',
    data: {
      labels: monthRU,

      datasets: [{
        label: `${typeTransaction}`,
        data: Object.values(summaryObj),
        backgroundColor: setBarColor(),
        borderColor: setBarColor(),
        borderWidth: 1,
      }],
    },
    options: {
      title: {
        display: true,
        text: `${typeTransaction} for the ${choosenYear} year`,
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
        }],
      },

    },
  });
}

export default function generateBarChart() {
  countYears();
  renderBarHTML();
  createYearsBtns();
  buttonsListeners();
  filterTransaction();
  generateBar();
}
