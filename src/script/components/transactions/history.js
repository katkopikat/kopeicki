import app from '../../app';
import createElement from '../../utils/create';

const sortByDays = (list) => {
  const newList = [];

  for (let i = 0; i < list.length; i += 1) {
    if (!newList.length) {
      newList.push([list[i]]);
    } else {
      newList.forEach((item) => {
        if (item[0].date === list[i].date) {
          item.push(list[i]);
        } else {
          newList.push([list[i]]);
        }
      });
    }
  }
  return newList;
};

const formatDate = (date) => {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  return `${y}-${m <= 9 ? `0${m}` : m}-${d <= 9 ? `0${d}` : d}`;
};

export default async function renderHistory() {
  const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };

  const transactions = await app.api.getTransactions();
  console.log(transactions);
  if (transactions) {
    const last7transactions = transactions.slice(0, 7);
    const days = sortByDays(last7transactions);

    document.querySelector('.transactions-history').innerHTML = '';

    days.forEach((day) => {
      const dateDiv = createElement('div');
      const dayDiv = createElement('div', 'day');

      const today = formatDate(new Date());
      const yesterday = formatDate(new Date(new Date().setDate(new Date().getDate() - 1)));
      const date = new Date(day[0].date);
      const formattedDate = new Intl.DateTimeFormat('en-GB', dateOptions).format(date);

      let dayOfWeek;

      if (today === formatDate(date)) {
        dayOfWeek = 'today';
      } else if (yesterday === formatDate(date)) {
        dayOfWeek = 'yesterday';
      } else {
        [dayOfWeek] = formattedDate.split(',');
      }

      dateDiv.insertAdjacentHTML(
        'beforeend',
        `
          <span class="day-of-week">${dayOfWeek},</span>
          <span class="date">${formattedDate.split(',')[1]}</span>
        `,
      );

      day.forEach((transaction) => {
        dayDiv.insertAdjacentHTML(
          'beforeend',
          `
          <div class="row">
          <div class="col">
            <p class="account-name">${transaction.account}</p>
            <p class="category-name">${transaction.category}</p>
          </div>
          <div class="col">
            <p class="money-amount ${transaction.type}">${transaction.amount}</p>
            <p class="description">${transaction.description}</p>
          </div>
        </div>
          `,
        );
      });

      const container = createElement('div', '', [dateDiv, dayDiv]);
      document.querySelector('.transactions-history').prepend(container);
    });
  }
}
