import createElement from '../../utils/create';

export default function statisticsHtml() {
  const main = document.querySelector('main');

  const row = createElement('div', 'row');
  const mainContainer = createElement('div', 'container-xxl transactions-container', row);

  main.append(mainContainer);

  const charts = createElement('div', 'col-6 charts-wrapper');
  const table = createElement('div', 'col-5 table-wrapper');

  row.append(charts);
  row.append(table);
}
