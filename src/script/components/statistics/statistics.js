import renderStatisticsHtml from './statisticsHtml';
import renderBarChart from './bar';
import renderDoughnutChart from './doughnut';
import renderTable from './table';

export default function renderStatisticsPage() {
  renderStatisticsHtml();
  renderDoughnutChart();
  renderBarChart();
  renderTable();
}
