import './styles/main.scss';
import 'bootstrap';

// import renderAuthorizationPage from './script/components/authorization/authorization';
import renderStatisticsPage from './script/components/statistics/statistics';
import renderSettingsPage from './script/components/settings/settings';
import renderTransactionsPage from './script/components/transactions/transactions';

const Planning = () => {
  console.log('Отрисовалась планинг');
};

const router = () => {
  const routes = [
    { path: '/statistics', component: renderStatisticsPage },
    { path: '/planning', component: Planning },
    { path: '/settings', component: renderSettingsPage },
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

  router();
});
