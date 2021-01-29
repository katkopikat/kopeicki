import renderTextStatistics from './statisticsInfo';
import renderBarChart from './bar';
import renderDoughnutChart from './doughnut';

function preloader() {
  const preloaderEl = document.getElementById('preloader');
  preloaderEl.classList.toggle('visible');
}

export default function renderStatisticsPage() {
  preloader();
  renderTextStatistics();
  renderDoughnutChart();
  renderBarChart();
}
