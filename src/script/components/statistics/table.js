import history from '../../helpers/history_transactions';
import createElement from '../../utils/create';

let typeTransaction = 'all';
let filtredHistory = history;

function formatDate(date) {
  let dd = date.getDate();
  if (dd < 10) dd = `0${dd}`;

  let mm = date.getMonth() + 1;
  if (mm < 10) mm = `0${mm}`;

  let yy = date.getFullYear() % 100;
  if (yy < 10) yy = `0${yy}`;

  return `${dd}.${mm}.${yy}`;
}

function rendertableBtns() {
  const tableTypeBtns = createElement(
    'div',
    'btn-group btn-group-toggle type-table',
    null,
    ['toggle', 'buttons'],
  );
  tableTypeBtns.insertAdjacentHTML(
    'beforeend',
    `
    <label class="btn btn-secondary">
    <input type="radio" name="type-table" id="all" autocomplete="on"> All
    </label>
    <label class="btn btn-secondary active">
    <input type="radio" name="type-table" id="expense" autocomplete="off" checked> Expense
    </label>
    <label class="btn btn-secondary">
    <input type="radio" name="type-table" id="income" autocomplete="off"> Income
    </label>`,
  );

  //document.querySelector('.table-wrapper').append(tableTypeBtns);
}

function filterTransaction() {
    if (typeTransaction === 'all') return history;

   return history.filter((transaction) => transaction.type === typeTransaction);
}

function buttonsListeners() {
  document.querySelectorAll('[name="type-table"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.checked === true) {
        typeTransaction = btn.id;
        rerenderTable(typeTransaction);
      }
    });
  });
}

function rerenderTable() {
  // document.querySelector('.table').remove();
  tableCreate();
}

export default function tableCreate(filtredHistoryArray) {

filtredHistoryArray = filterTransaction();

  const table = document.createElement('table');
  table.className = 'table';

  table.innerHTML = `<thead>
      <tr>
        <th scope="col">Date</th>
        <th scope="col">Category</th>
        <th scope="col">Amount</th>
        <th scope="col">Account</th>
        <th scope="col">Description</th>
      </tr>
    </thead>`;
  const tbody = document.createElement('tbody');
  table.appendChild(tbody);

  filtredHistoryArray.forEach((transaction, i) => {
    const row = tbody.insertRow(i);
    const cell1 = row.insertCell();
    const cell2 = row.insertCell();
    const cell3 = row.insertCell();
    const cell4 = row.insertCell();
    const cell5 = row.insertCell();

    cell1.className = 'cell__date';
    cell2.className = 'cell__category';
    cell3.className = 'cell__amount';
    cell4.className = 'cell__account';
    cell5.className = 'cell__description';

    cell1.innerHTML = formatDate(new Date(transaction.date)),
    cell2.innerHTML = transaction.category,
    cell3.innerHTML = transaction.amount;
    cell4.innerHTML = transaction.account;
    cell5.innerHTML = transaction.description;
  });

  document.querySelector('.table-wrapper').append(table);
}

filterTransaction();
rendertableBtns();
buttonsListeners();
