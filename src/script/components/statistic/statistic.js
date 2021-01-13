import generateBarChart from './bar';
import generateDoughnutChart from './doughnut';

export default function renderStatistic() {
  generateDoughnutChart();
  generateBarChart();
}
