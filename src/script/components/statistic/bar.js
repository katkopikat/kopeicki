/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
import { Chart } from 'chart.js';
import history from '../../helpers/history_transactions';

const barContainer = document.querySelector('.bar-container');
const yearsBtnsContainer = document.querySelector('.bar-years');
let barChart = null;
let typeTransaction = 'expense';
const monthRU = ['янв', 'фев', 'март', 'апр', 'май', 'июн', 'июл', 'авг', 'сент', 'окт', 'нояб', 'дек'];

let choosenYear = new Date().getFullYear();
const yearsList = [];
let summaryObj = {};

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
  yearsList.sort((a, b) => b - a)
    .forEach((year, i) => {
      const checkedParam = i === 0 ? 'checked' : '';
      yearsBtnsContainer.insertAdjacentHTML(
        'beforeend',
        `
    <label class="btn btn-secondary active">
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
        generateBarChart();
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
        generateBarChart();
      }
    });
  });
}

countYears();
createYearsBtns();
buttonsListeners();
filterTransaction();

export default function generateBarChart() {
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
        text: `${typeTransaction} for the last year`,
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
