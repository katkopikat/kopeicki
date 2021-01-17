import statisticsHtml from './statisticsHtml';
import generateBarChart from './bar';
import generateDoughnutChart from './doughnut';
import renderTable from './table';

export default function renderStatisticsPage() {
  statisticsHtml();
  generateBarChart();
  generateDoughnutChart();
  renderTable();
}
