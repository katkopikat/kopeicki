import generateBarChart from './bar';
import generateDoughnutChart from './doughnut';

export default function renderStatisticsPage() {
  generateBarChart();
  generateDoughnutChart();
}
