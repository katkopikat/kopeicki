import './styles/main.scss';
import 'bootstrap';

import renderAuthorizationPage from './script/components/authorization/authorization';
import toggleSettings from './script/components/settings/settings';
import renderStatisticsPage from './script/components/statistics/statistics';
import renderTransactionsPage from './script/components/transactions/transactions';
import navSlideIn from './script/components/navbar';
import app from './script/app';

// app.renderTransactionsPage = renderTransactionsPage;

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

  try {
    match.component();
  } catch (e) {
    console.log(e.message);
  }
  // match.component();
};

const navigateTo = (url) => {
  if (app.user) {
    window.history.pushState(null, null, url);
    router();
  }
};

toggleSettings();

window.addEventListener('popstate', router);

window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.nav__list').addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      navigateTo(e.target.href);

      document.querySelectorAll('.nav__link').forEach((el) => {
        el.classList.remove('active');
      });
      e.target.classList.add('active');
    }
  });

  app.init().then(router);
  router();
});

navSlideIn();
