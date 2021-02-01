/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
import { Chart } from 'chart.js';
import createElement from '../../utils/create';
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
let totalByMonth = {};
let dataHistory;

function renderBarHTML() {
  const barWrapperDiv = createElement('div', 'bar-wrapper');
  const barHeading = createElement('h3', 'heading heading-bar');
  const barCanvas = createElement('canvas', 'bar-container');
  const barTypeBtnsWrapper = createElement('div', 'toggle bar-type');

  const barYearsBtnsWrapper = createElement('div', 'btns-year-container');

  const barTypeBtns = `
  <input type="checkbox" class="checkbox" id="bar-type" />
  <span data-i18n="Expenses">Expenses</span>
  <label for="bar-type" class="label">
    <div class="ball"></div>
  </label>
  <span data-i18n="Income">Income</span>`;

  document.querySelector('.charts-wrapper').append(barWrapperDiv);
  barWrapperDiv.append(barHeading, barCanvas, barYearsBtnsWrapper, barTypeBtnsWrapper);

  barTypeBtnsWrapper.insertAdjacentHTML(
    'beforeend',
    `${barTypeBtns}
  `,
  );
}
/* Set bar display settings */
function renderHeading() {
  const lang = getLanguage();
  const barHeading = document.querySelector('.heading-bar');
  const type = typeTransaction;
  if (lang === 'ru') {
    barHeading.innerHTML = `Суммарные <span data-i18n="${type}">${type}</span> за ${choosenYear} год.`;
  } else if (lang === 'by') {
    barHeading.innerHTML = `Сумарны <span data-i18n="${type}">${type}</span> за ${choosenYear} год.`;
  } else {
    barHeading.innerHTML = `Total <span data-i18n="${type}">${type}</span> for the ${choosenYear} year.`;
  }
}

function setBarColor() {
  return new Array(12).fill(typeTransaction === 'expenses' ? 'rgba(50, 124, 235, 1)' : 'rgba(75, 192, 192, 1)');
}

function setLegendFontSize() {
  if (window.innerWidth <= 500) return 8;
  if (window.innerWidth <= 700) return 10;
  return 12;
}

function setMonthLang() {
  const lang = getLanguage();
  switch (lang) {
    case 'by':
      return monthBe;
    case 'ru':
      return monthRu;
    default:
      return monthEn;
  }
}

/* Create buttons controllers */
function countYears() {
  dataHistory.forEach((trans) => {
    const temp = new Date(trans.date).getFullYear();
    if (!yearsList.includes(temp)) {
      yearsList.push(temp);
    }
  });
}

function createYearsBtns() {
  const yearsBtnsContainer = document.querySelector('.btns-year-container');

  yearsList
    .sort((a, b) => b - a)
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
    generateBarInstance();
    transition();
  });
}

function buttonsYearsListeners() {
  document.querySelectorAll('[name="bar-year"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.checked === true) {
        choosenYear = Number(btn.id);
        barChart.destroy();
        filterTransaction();
        generateBarInstance();
        renderHeading();
      }
    });
  });
}

/* Filtering data  */
function filterTransaction() {
  clearDataObject();

  const filtredHistory = dataHistory.filter((transaction) => {
    const trYear = new Date(transaction.date).getFullYear();
    return transaction.type === typeTransaction && trYear === choosenYear;
  });

  filtredHistory.reduce((total, trans) => {
    const trMonth = new Date(trans.date).getMonth();
    if (Object.prototype.hasOwnProperty.call(total, trMonth)) {
      total[trMonth] += parseInt(trans.amount, 10);
    } else {
      total[trMonth] = parseInt(trans.amount, 10);
    }
    return total;
  }, totalByMonth);
}

function clearDataObject() {
  totalByMonth = {
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

function generateBarInstance() {
  const barContainer = document.querySelector('.bar-container');
  barChart = new Chart(barContainer, {
    type: 'bar',
    data: {
      labels: setMonthLang(),
      datasets: [
        {
          minBarLength: 2,
          label: `${typeTransaction}`,
          data: Object.values(totalByMonth),
          backgroundColor: setBarColor(),
          borderColor: setBarColor(),
          borderWidth: 1,
        },
      ],
    },
    options: {
      title: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              fontSize: setLegendFontSize(),
              callback(value) {
                return Number(value) >= 1000 ? `${String(value).slice(0, -3)}K` : value;
              },
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              fontSize: setLegendFontSize(),
            },
          },
        ],
      },
      legend: {
        display: false,
      },
    },
  });
}

/* Settings for responsive */
function trackWindowSize(e) {
  if (e.matches) {
    barChart.destroy();
    generateBarInstance();
  }
}

function mediaQuerySizes() {
  const breakpoints = ['(max-width: 700px)', '(max-width: 500px)', '(min-width: 700px)', '(min-width: 50px)'];

  breakpoints.forEach((it) => {
    const mediaQuery = window.matchMedia(it);
    mediaQuery.addListener(trackWindowSize);
    trackWindowSize(mediaQuery);
  });
}

/* Label translation when the language changes.
     Whaiting rendering menu and change language on the localStorage. */

function trackLanguageSwitch() {
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.select__list').addEventListener('click', () => {
      setTimeout(() => {
        barChart.destroy();
        generateBarInstance();
      }, 0);
    });
  });
}

/* MAIN */
export default function renderBarChart(data) {
  dataHistory = data;
  countYears();
  renderBarHTML();
  createYearsBtns();
  buttonsTypeListeners();
  buttonsYearsListeners();
  filterTransaction();
  generateBarInstance();
  renderHeading();
  translatePage();
  mediaQuerySizes();
  trackLanguageSwitch();
}
