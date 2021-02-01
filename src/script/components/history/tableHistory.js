/* eslint-disable no-use-before-define */
import createElement from '../../utils/create';
import app from '../../app';
import translatePage from '../settings/language';
import { clearPage } from '../../utils/DOM';
import createSelect from '../../utils/select';
import { formatDate } from '../../utils/helpers';

let history;
let typeTransaction = 'all';
let categoryName = 'ALL CATEGORIES';
const incomeCategories = [];
const expensesCategories = [];

function preloader() {
  const preloaderEl = document.getElementById('preloader');
  preloaderEl.classList.toggle('visible');
}

/* Getting and filtering data */
function getUsersCategory() {
  app.user.income.forEach((it) => { incomeCategories.push(it.name); });
  app.user.expenses.forEach((it) => { expensesCategories.push(it.name); });
}

async function getHistory() {
  const transactions = await app.api.getTransactions();
  history = [...transactions];
}

function filterTransaction(categName) {
  const dataSortByDate = history.sort((a, b) => b.date - a.date);
  let filtredTable = dataSortByDate;
  if (typeTransaction === 'all') filtredTable = dataSortByDate;
  else filtredTable = dataSortByDate.filter((transaction) => transaction.type === typeTransaction);

  if (categoryName.match('ALL CATEGORIES' || 'ВСЕ КАТЕГОРИИ' || 'УСЕ КАТЭГОРЫІ')) return filtredTable;
  return filtredTable.filter((transaction) => transaction.category === categName);
}

/* Delete transactions */
async function deleteTransactionCallback(el) {
  if ((el).classList.contains('cell__delete')) {
    const idDelete = el.getAttribute('data-id');
    app.deleteTransaction(idDelete).then(() => {
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

/* Genarate table HTML */
function historyHtml() {
  const main = document.querySelector('main');
  const row = createElement('div', 'row table-wrapper');
  const mainContainer = createElement('div', 'container-xxl table-container', row);
  const tableHeading = createElement('h3', 'heading heading-table', null, ['i18n', 'transactionHistory']);
  const table = createElement('div', 'table-mask');

  const tableBtnsWrapper = createElement(
    'div',
    'btns-table-container',
  );

  main.append(mainContainer);
  row.append(tableHeading, tableBtnsWrapper, table);
  tableHeading.innerText = 'История транзакций';
}

function tableCreate() {
  const filtredHistory = filterTransaction(categoryName);
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
  filtredHistory.forEach((transaction, i) => {
    const row = tbody.insertRow(i);
    const cell1 = row.insertCell();
    const cell2 = row.insertCell();
    const cell3 = row.insertCell();
    const cell4 = row.insertCell();
    const cell5 = row.insertCell();
    const cell6 = row.insertCell();

    const {
      type, date, category, amount, account, description, id,
    } = transaction;

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

/* Create constollers */
function createCategoryList() {
  let renderList;
  if (typeTransaction === 'expenses') renderList = expensesCategories;
  else if (typeTransaction === 'income') renderList = incomeCategories;
  else renderList = [...incomeCategories, ...expensesCategories];

  createSelect(document.querySelector('.btns-table-container'), {
    placeholder: 'ALL',
    class: 'category-list',
    list: ['ALL CATEGORIES', ...renderList],
    isTranslatable: true,
  });

  document.querySelector('#ALL').classList.add('selected');
  document.querySelector('#ALL').setAttribute('data-i18n', 'allCategories');
  document.querySelector('#ALL').innerHTML = 'ALL CATEGORIES';

  setTimeout(() => {
    document.querySelectorAll('.select__item').forEach((it) => {
      it.addEventListener('click', () => {
        categoryName = it.id;
        document.querySelector('.table').remove();
        tableCreate();
        deleteTransaction();
      });
    });
  }, 1000);
}

function clearCategoryList() {
  document.querySelector('.table-wrapper .select').remove();
}

function renderTableBtns() {
  const tableTypeBtns = document.querySelector('.btns-table-container');
  tableTypeBtns.insertAdjacentHTML(
    'beforeend',
    `<ul>
      <li>
        <input type="radio" id="all" name="table-type" checked >
        <label for="all" data-i18n="All">All</label>
        <div class="check"></div>
      </li>
      <li>
        <input type="radio" id="expenses" name="table-type">
        <label for="expenses" data-i18n="Expenses">Expenses</label>
        <div class="check"></div>
      </li>
      <li>
        <input type="radio" id="income" name="table-type">
        <label for="income" data-i18n="Income">Income</label>
        <div class="check"></div>
      </li>`,
  );
}

function rerenderTable() {
  preloader();
  getHistory().then(() => {
    document.querySelector('.table').remove();
    clearCategoryList();
    filterTransaction(categoryName);
    createCategoryList();
    tableCreate();
    deleteTransaction();
    translatePage();
    preloader();
  });
}

function buttonsTypeListeners() {
  document.querySelectorAll('[name="table-type"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.checked === true) {
        typeTransaction = btn.id;
        categoryName = 'ALL CATEGORIES';
        rerenderTable();
      }
    });
  });
}

/* MAIN */
function createTableContent() {
  getUsersCategory();
  filterTransaction(categoryName);
  tableCreate();
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
