import { Chart } from 'chart.js';
import history from '../../helpers/history_transactions';

const barContainer = document.querySelector('.bar-container');
const yearsBtnsContainer = document.querySelector('.bar-years');

const typeTransaction = 'income';
const monthRU = ['янв', 'фев', 'март', 'апр', 'май', 'июн', 'июл', 'авг', 'сент', 'окт', 'нояб', 'дек'];
let summaryObj = {
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
let barChart = null;
const yearsList = [];

function countYears() {
  history.forEach((trans) => {
    const temp = (new Date(trans.date)).getFullYear();
    if (!yearsList.includes(temp)) {
      yearsList.push(temp);
    }
  });
}

function createYearsBtns() {
  countYears();
 
  yearsList.sort((a, b) => b - a)
    .forEach((year, i) => {
      let checkedParam = i === 0 ? 'checked' : '';
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
createYearsBtns();

function filterTransaction() {
  const filtredHistory = history.filter((transaction) => transaction.type === typeTransaction);

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
  console.log(summaryObj);
}
filterTransaction();
// return trDate.getFullYear() === today.getFullYear()

//       const transM = trDate.getMonth();

//     }
//     return trDate.getMonth() === today.getMonth() && transaction.type === typeTransaction;
//   });

//   summaryObj = filtredHistory.reduce((summary, trans) => {
//     if (Object.prototype.hasOwnProperty.call(summary, trans.category)) {
//       summary[trans.category] += parseFloat(trans.amount);
//     } else {
//       summary[trans.category] = parseFloat(trans.amount);
//     }
//     return summary;
//   },
//   {});
// }

export default function generateBarChart() {
  barChart = new Chart(barContainer, {
    type: 'bar',
    data: {
      labels: monthRU,

      datasets: [{
        label: `${typeTransaction}`,
        data: Object.values(summaryObj),
        backgroundColor: [
          'rgba(47, 186, 147, 0.65)',
          'rgba(47, 186, 147, 0.7)',
          'rgba(47, 186, 147, 0.75)',
          'rgba(47, 186, 147, 0.8)',
          'rgba(47, 186, 147, 0.85)',
          'rgba(47, 186, 147, 0.9)',
          'rgba(47, 186, 147, 0.85)',
          'rgba(47, 186, 147, 0.8)',
          'rgba(47, 186, 147, 0.75)',
          'rgba(47, 186, 147, 0.7)',
          'rgba(47, 186, 147, 0.65)',
          'rgba(47, 186, 147, 0.6)',
        ],
        borderColor: [
          'rgba(47, 186, 147, 1)',
        ],
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

// export default function generateBarChart() {
//   const myChart = new Chart(ctx, {
//   type: 'bar',
//   data: {
//     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange', 'Red', 'Blue', 'Yellow'],
//     datasets: [{
//       label: '# of Votes',
//       data: [12, 19, 3, 5, 2, 3, 7, 2, 10],
//       backgroundColor: [
//         'rgba(255, 99, 132, 0.5)',
//         'rgba(54, 162, 235, 0.5)',
//         'rgba(255, 206, 86, 0.5)',
//         'rgba(75, 192, 192, 0.5)',
//         'rgba(153, 102, 255, 0.5)',
//         'rgba(255, 159, 64, 0.5)',
//       ],
//       borderColor: [
//         'rgba(255, 99, 132, 1)',
//         'rgba(54, 162, 235, 1)',
//         'rgba(255, 206, 86, 1)',
//         'rgba(75, 192, 192, 1)',
//         'rgba(153, 102, 255, 1)',
//         'rgba(255, 159, 64, 1)',
//       ],
//       borderWidth: 1,
//     }],
//   },
//   options: {
//     scales: {
//       yAxes: [{
//         ticks: {
//           beginAtZero: true,
//         },
//       }],
//     },
//   },
// });
// }
