/* eslint-disable no-use-before-define */
import createElement from '../../utils/create';
import app from '../../app';
import api from '../../api';
import translatePage from '../settings/language';
import { clearPage } from '../../utils/DOM';
import createSelect from '../../utils/select';

let typeTransaction = 'all';
let history;
const categoryName = 'ALL';

function preloader() {
  const preloaderEl = document.getElementById('preloader');
  preloaderEl.classList.toggle('visible');
}

function historyHtml() {
  const main = document.querySelector('main');
  const row = createElement('div', 'row table-wrapper');
  const mainContainer = createElement('div', 'container-xxl table-container', row);
  const tableHeading = createElement('h3', 'heading heading-table');
  const table = createElement('div', 'table-mask');

  const tableBtnsWrapper = createElement(
    'div',
    'btns-table-container',
  );

  main.append(mainContainer);
  row.append(tableHeading, tableBtnsWrapper, table);
  tableHeading.innerText = 'История транзакций';
}

function formatDate(date) {
  let dd = date.getDate();
  if (dd < 10) dd = `0${dd}`;

  let mm = date.getMonth() + 1;
  if (mm < 10) mm = `0${mm}`;

  let yy = date.getFullYear() % 100;
  if (yy < 10) yy = `0${yy}`;

  return `${dd}.${mm}.${yy}`;
}

async function getHistory() {
  const transactions = await app.api.getTransactions();
  history = [...transactions];
}

function filterTransaction() {
  const historyByDate = history.sort((a, b) => b.date - a.date);
  if (typeTransaction === 'all') return historyByDate;
  return historyByDate.filter((transaction) => transaction.type === typeTransaction);

  // const trDate = new Date(transaction.date);
  // if (period === 'year') {
  //   const oneYearAgo = new Date().setFullYear(new Date().getFullYear() - 1);
  //   return moment(transaction.date).isBetween(oneYearAgo, moment.now())
  //          && transaction.type === typeTransaction;
  // }
  // return trDate.getMonth() === today.getMonth() && transaction.type === typeTransaction;
}

function createCategoryList() {
  const tr = filterTransaction();

  const summaryObj = tr.reduce((summary, trans) => {
    if (Object.prototype.hasOwnProperty.call(summary, trans.category)) {
      summary[trans.category] += parseInt(trans.amount, 10);
    } else {
      summary[trans.category] = parseInt(trans.amount, 10);
    }
    return summary;
  },
  {});

  const categoryList = createSelect(document.querySelector('.btns-table-container'), {
    placeholder: 'ALL',
    class: 'category-list',
    list: ['ALL', ...Object.keys(summaryObj)],
    isTranslatable: true,
  });

  document.querySelector('#ALL').classList.add('selected');

  setTimeout(() => {
    document.querySelectorAll('.select__item').forEach((it) => {
      it.addEventListener('click', () => {
        console.log(it.id);
        let filtred = filterByCategory(it.id);
        document.querySelector('.table').remove();
        tableCreate(filtred);
        deleteTransaction();
      // preloader();
      });
    });
  }, 1000);
}

function filterByCategory(categ) {
  const tr = filterTransaction();

  if (categ === 'ALL') return tr;
  return tr.filter((transaction) => transaction.category === categ);

  
}

function tableCreate(filtredTransactioon) {
  // const filtredHistory = filterTransaction();
  const table = document.createElement('table');
  table.className = 'table';
  table.innerHTML = `<thead>
      <tr>
        <th scope="col" data-i18n="Date">Date</th>
        <th scope="col" data-i18n="Category">Category</th>
        <th scope="col" data-i18n="Amount">Amount</th>
        <th scope="col" data-i18n="Account">Account</th>
        <th scope="col" data-i18n="Description">Description</th>
        <th scope="col" data-i18n="Delete">Delete</th>
      </tr>
    </thead>`;
  const tbody = document.createElement('tbody');
  table.appendChild(tbody);
  filtredTransactioon.forEach((transaction, i) => {
    const row = tbody.insertRow(i);
    const cell1 = row.insertCell();
    const cell2 = row.insertCell();
    const cell3 = row.insertCell();
    const cell4 = row.insertCell();
    const cell5 = row.insertCell();
    const cell6 = row.insertCell();

    const { type, date, category, amount, account, description, id } = transaction;

    cell1.className = 'cell__date';
    cell2.className = type === 'expenses' ? 'cell__category-expense' : 'cell__category-income';
    cell3.className = 'cell__amount';
    cell4.className = 'cell__account';
    cell5.className = 'cell__description';
    cell6.className = 'cell__delete';

    cell1.innerHTML = formatDate(new Date(date));
    cell2.innerHTML = category;
    cell3.innerHTML = amount;
    cell4.innerHTML = account;
    cell5.innerHTML = description;
    cell6.innerHTML = 'delete';

    cell2.dataset.i18n = category;
    cell4.dataset.i18n = account;
    cell6.dataset.i18n = 'Delete';
    cell6.dataset.id = id;
  });

  document.querySelector('.table-mask').append(table);
}

async function deleteTransactionCallback(el) {
  if ((el).classList.contains('cell__delete')) {
    const idDelete = el.getAttribute('data-id');
    // eslint-disable-next-line no-use-before-define
    api.deleteTransaction(idDelete).then(() => {
      rerenderTable();
    });
  }
}

function deleteTransaction() {
  document.querySelector('.table').addEventListener('click', (e) => {
    e.preventDefault();
    deleteTransactionCallback(e.target);
  });
}

function renderTableBtns() {
  const tableTypeBtns = document.querySelector('.btns-table-container');
  tableTypeBtns.insertAdjacentHTML(
    'beforeend',
    `<ul>
      <li>
        <input type="radio" id="all" name="table-type" checked >
        <label for="all">All</label>
        <div class="check"></div>
      </li>
      <li>
        <input type="radio" id="expenses" name="table-type">
        <label for="expenses">Expenses</label>
        <div class="check"></div>
      </li>
      <li>
        <input type="radio" id="income" name="table-type">
        <label for="income">Income</label>
        <div class="check"></div>
      </li>`,
  );
}

function rerenderTable() {
  preloader();
  getHistory().then(() => {
    document.querySelector('.table').remove();
    filterTransaction();
    tableCreate();
    deleteTransaction();
    preloader();
  });
}

function buttonsTypeListeners() {
  document.querySelectorAll('[name="table-type"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.checked === true) {
        typeTransaction = btn.id;
        rerenderTable();
      }
    });
  });
}

function createTableContent() {
  // filterTransaction();
  tableCreate(filterTransaction());
  renderTableBtns();
  createCategoryList();
  buttonsTypeListeners();
  deleteTransaction();
  translatePage();
}

export default function renderHistoryPage() {
  preloader();
  getHistory().then(() => {
    clearPage();
    historyHtml();
    createTableContent();
    preloader();
  });
}
