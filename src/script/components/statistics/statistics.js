import renderStatisticsHtml from './statisticsInfo';
import renderBarChart from './bar';
import renderDoughnutChart from './doughnut';

export default function renderStatisticsPage() {
  renderStatisticsHtml();
  renderDoughnutChart();
  renderBarChart();
}
