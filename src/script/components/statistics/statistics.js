import renderTextStatistics from './statisticsInfo';
import renderBarChart from './bar';
import renderDoughnutChart from './doughnut';
import { clearPage } from '../../utils/DOM';
import app from '../../app';

let data = null;
function preloader() {
  const preloaderEl = document.getElementById('preloader');
  preloaderEl.classList.toggle('visible');
}

async function getDataHistory() {
  const transactions = await app.api.getTransactions();
  data = [...transactions];
}

export default function renderStatisticsPage() {
  Promise.all([getDataHistory(), app.api.getTransactionsStats()]).then(([, stat]) => {
    clearPage();
    preloader();
    renderTextStatistics(stat);
    renderDoughnutChart(data);
    renderBarChart(data);
  });
}
