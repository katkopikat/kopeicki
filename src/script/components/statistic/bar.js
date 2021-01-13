import { Chart } from 'chart.js';
import history from '../../helpers/history_transactions';

const typeTransaction = 'expense';
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
  const ctx = document.querySelector('.bar-container');

  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: monthRU,
      datasets: [{
        data: Object.values(summaryObj),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      }],
    },
    options: {
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
