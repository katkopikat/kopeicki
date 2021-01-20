import './styles/main.scss';
import 'bootstrap';

import renderAuthorizationPage from './script/components/authorization/authorization';
import toggleSettings from './script/components/settings/settings';
import renderStatisticsPage from './script/components/statistics/statistics';
import renderTransactionsPage from './script/components/transactions/transactions';
import app from './script/app';

app.renderTransactionsPage = renderTransactionsPage;

const Planning = () => {
  console.log('Отрисовалась планинг');
};

const router = () => {
  const routes = [
    { path: '/statistics', component: renderStatisticsPage },
    { path: '/planning', component: Planning },
    { path: '/login', component: renderAuthorizationPage },
    { path: '/', component: renderTransactionsPage },
  ];

  const path = window.location.href;

  const match = routes.find((r) => path.includes(r.path));

  document.querySelector('main').innerHTML = '';

  match.component();
};

const navigateTo = (url) => {
  window.history.pushState(null, null, url);
  router();
};

toggleSettings();

window.addEventListener('popstate', router);

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('navbar').addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      navigateTo(e.target.href);

      document.querySelectorAll('.nav-item').forEach((el) => {
        el.classList.remove('active');
      });
      e.target.classList.add('active');
    }
  });

  app.init().then(router);
  // router();
});
