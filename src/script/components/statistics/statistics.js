import createElement from '../../utils/create';
import generateBarChart from './bar';
import generateDoughnutChart from './doughnut';
import tableCreate from './table';

export default function renderStatisticsPage() {

  const main = document.querySelector('main')

  const row = createElement('div', 'row');
  const mainContainer = createElement('div', 'container-xxl transactions-container', row);

  main.append(mainContainer);

  const charts = createElement('div', 'col-6 charts-wrapper');
  const table = createElement('div', 'col-5 table-wrapper');

  row.appendChild(charts);
  row.appendChild(table);

  generateBarChart();
  generateDoughnutChart();
  tableCreate();

  console.log('Отрисовалась статистика')
}
