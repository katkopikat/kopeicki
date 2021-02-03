import { Chart } from 'chart.js';
import moment from 'moment';
import createElement from '../../utils/create';
import { getTheme, getLanguage } from '../../utils/localStorage';
import { moveToggle } from '../../utils/DOM';
import translatePage from '../settings/language';
import translations from '../../data/translations';

const today = new Date();
let typeTransaction = 'expenses';
let period = 'mounth';
let filtredData = null;
let doughnut = null;
let dataHistory;

function preloader() {
  const preloaderEl = document.getElementById('preloader');
  preloaderEl.classList.toggle('visible');
}

function filterTransactions() {
  const filtredByPeriod = dataHistory.filter((transaction) => {
    const trDate = new Date(transaction.date);
    if (period === 'year') {
      const oneYearAgo = new Date().setFullYear(new Date().getFullYear() - 1);
      return moment(transaction.date).isBetween(oneYearAgo, moment(new Date()).add(1, 'days'))
             && transaction.type === typeTransaction;
    }
    return trDate.getMonth() === today.getMonth()
        && trDate.getFullYear() === today.getFullYear()
        && transaction.type === typeTransaction;
  });

  filtredData = filtredByPeriod.reduce((total, transaction) => {
    const tempTotal = total;
    if (Object.prototype.hasOwnProperty.call(total, transaction.category)) {
      tempTotal[transaction.category] += parseInt(transaction.amount, 10);
    } else {
      tempTotal[transaction.category] = parseInt(transaction.amount, 10);
    }
    return total;
  },
  {});
}

/* Set settings for doughnuts chart */
function renderDoughnutHTML() {
  const doughnutWrapperDiv = createElement('div', 'wrapper-doughnut');
  const doughnutHeading = createElement('h3', 'heading heading-doughnut');
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
  doughnutWrapperDiv.append(doughnutHeading, doughnutCanvas,
    doughnutPeriodBtnsWrapper, doughnutTypeBtnsWrapper);

  doughnutPeriodBtnsWrapper.insertAdjacentHTML(
    'beforeend',
    `${doughnutPeriodBtns}`,
  );
  doughnutTypeBtnsWrapper.insertAdjacentHTML(
    'beforeend',
    `${doughnutTypeBtns}`,
  );
}

function setBGColor() {
  return getTheme() === 'light' ? 'rgba(234, 240, 247, 1)' : 'rgba(29, 32, 43, 1)';
}

function setLegendDisplay() {
  if (window.innerWidth <= 450) {
    return {
      display: false,
    };
  }
  if (window.innerWidth <= 500) {
    return {
      display: true,
      position: 'bottom',
      labels: {
        fontSize: 8,
        boxWidth: 10,
      },
    };
  } if (window.innerWidth <= 700) {
    return {
      display: true,
      position: 'bottom',
      labels: {
        fontSize: 10,
        boxWidth: 10,
      },
    };
  }
  return {
    display: true,
    position: 'bottom',
    labels: {
      fontSize: 11,
      boxWidth: 20,
      padding: 20,
    },
  };
}

function calculateTotalSum() {
  return Object.values(filtredData).length !== 0
    ? parseInt(Object.values(filtredData).reduce((sum, it) => sum + it), 10) : 0;
}

function renderHeading() {
  const doughnutHeading = document.querySelector('.heading-doughnut');
  doughnutHeading.innerText = `Total ${typeTransaction} for the ${period} ${calculateTotalSum()} rub.`;
}

function translateCategoriesNames() {
  const lang = getLanguage();
  const categoryName = Object.keys(filtredData);
  const dictionary = (Object.keys(translations[lang]));
  return categoryName.map((it) => (dictionary.includes(it) ? translations[lang][it] : it));
}

/* Renderings Chart instance */
function generateChart() {
  const canvas = document.querySelector('.doughnut-container');
  doughnut = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: Object.keys(filtredData).length !== 0 ? translateCategoriesNames() : ['You`re haven`t any transactions'],
      datasets: [{
        data: Object.values(filtredData).length !== 0 ? Object.values(filtredData) : [1],
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
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
      },
      responsive: true,
      cutoutPercentage: 50,
      title: {
        position: 'top',
        fontSize: 12,
        text: `Total ${typeTransaction} for the ${period} ${calculateTotalSum()} rub.`,
      },
      legend: setLegendDisplay(),
    },

  });
}

/* Rerender chart, when toggles are pusded or window size is changed */
function rerenderDoughnut() {
  doughnut.destroy();
  generateChart(typeTransaction, period);
}

/* Rerender chart, when toggles are pusded or window size is changed */
function rerenderDoughnutByToggles() {
  filterTransactions();
  rerenderDoughnut();
  renderHeading();
}

/* Buttons */
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
    rerenderDoughnutByToggles();
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
    rerenderDoughnutByToggles();
    transition();
  });
}

/* Settings for responsive or when theme is changing */
function trackWindowSize(e) {
  if (e.matches) {
    rerenderDoughnut();
  }
}

function mediaQuerySizes() {
  const breakpoints = ['(max-width: 700px)', '(max-width: 500px)', '(max-width: 450px)',
    '(min-width: 700px)', '(min-width: 500px)', '(min-width: 450px)'];

  breakpoints.forEach((it) => {
    const mediaQuery = window.matchMedia(it);
    mediaQuery.addListener(trackWindowSize);
    trackWindowSize(mediaQuery);
  });
}

document.getElementById('theme').addEventListener('click', () => {
  if (doughnut) {
    if (document.location.href === 'https://kopeicki.netlify.app/statistics') {
      doughnut.destroy();
      setTimeout(generateChart, 0);
    }
  }
});

/* Only first time rendering Chart instance */
function createDoughnutContent() {
  filterTransactions();
  renderDoughnutHTML();
  buttonsTypeListeners();
  buttonsPeriodListeners();
  generateChart(typeTransaction, period);
  renderHeading();
  translatePage();
  preloader();
}

/* Main  */
export default function renderDoughnutChart(data) {
  dataHistory = data;
  createDoughnutContent();
  mediaQuerySizes();
}
