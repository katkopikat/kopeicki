/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
import { Chart } from 'chart.js';
import createElement from '../../utils/create';
import app from '../../app';
import { moveToggle } from '../../utils/DOM';
import { getLanguage } from '../../utils/localStorage';
import translatePage from '../settings/language';

let barChart = null;
let typeTransaction = 'expenses';
const monthRu = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек'];
const monthEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthBe = ['Студз', 'Люты', 'Сак', 'Крас', 'Май', 'Чэрв', 'Ліп', 'Жнів', 'Вер', 'Кастр', 'Ліст', 'Снеж'];

let choosenYear = new Date().getFullYear();
const yearsList = [];
let summaryObj = {};
let history;

function renderBarHTML() {
  const barWrapperDiv = createElement('div', 'bar-wrapper');
  const barCanvas = createElement('canvas', 'bar-container');
  const barTypeBtnsWrapper = createElement(
    'div',
    'toggle bar-type',
  );

  const barYearsBtnsWrapper = createElement(
    'div',
    'btns-year-container',
  );

  const barTypeBtns = `
  <input type="checkbox" class="checkbox" id="bar-type" />
  <span data-i18n="Expenses">Expenses</span>
  <label for="bar-type" class="label">
    <div class="ball"></div>
  </label>
  <span data-i18n="Income">Income</span>`;

  document.querySelector('.charts-wrapper').append(barWrapperDiv);
  barWrapperDiv.append(barCanvas, barYearsBtnsWrapper, barTypeBtnsWrapper);

  barTypeBtnsWrapper.insertAdjacentHTML(
    'beforeend',
    `${barTypeBtns}
  `,
  );
}

function setBarColor() {
  return new Array(12).fill(typeTransaction === 'expenses' ? 'rgba(50, 124, 235, 1)' : 'rgba(75, 192, 192, 1)');
}

function setMonthLang() {
  const lang = getLanguage();
  switch (lang) {
    case 'be':
      return monthBe;
    case 'ru':
      return monthRu;
    default:
      return monthEn;
  }
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
  const yearsBtnsContainer = document.querySelector('.btns-year-container');

  yearsList.sort((a, b) => b - a)
    .forEach((year, i) => {
      const checkedParam = i === 0 ? 'checked' : '';
      yearsBtnsContainer.insertAdjacentHTML(
        'beforeend',
        `
        <ul>
        <li>
          <input type="radio" id="${year}" name="bar-year" ${checkedParam}>
          <label for="${year}">${year}</label>
          <div class="check"></div>
        </li>`,
      );
    });
}

async function getHistory() {
  const transactions = await app.api.getTransactions();
  history = [...transactions];
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
      summary[trMonth] += parseInt(trans.amount, 10);
    } else {
      summary[trMonth] = parseInt(trans.amount, 10);
    }
    return summary;
  },
  summaryObj);
}

function buttonsTypeListeners() {
  const typeToggleDiv = document.querySelector('.toggle.bar-type');
  const typeToggle = document.getElementById('bar-type');
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
    barChart.destroy();
    filterTransaction();
    setBarColor();
    generateBar();
    transition();
  });
}

function buttonsYearsListeners() {
  document.querySelectorAll('[name="bar-year"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.checked === true) {
        choosenYear = btn.id;
        barChart.destroy();
        filterTransaction();
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
      labels: setMonthLang(),

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

function createBarContent() {
  countYears();
  renderBarHTML();
  createYearsBtns();
  buttonsTypeListeners();
  buttonsYearsListeners();
  filterTransaction();
  generateBar();
  translatePage();
}

export default function renderBarChart() {
  getHistory().then(() => createBarContent());
}
