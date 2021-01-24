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
  document.querySelector('.nav__list').addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      navigateTo(e.target.href);

      document.querySelectorAll('.nav__item').forEach((el) => {
        el.classList.remove('active');
      });
      e.target.classList.add('active');
    }
  });

  app.init().then(router);
  router();
});

const navSlideIn = () => {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  const main = document.querySelector('main');
  const links = document.querySelectorAll('.nav__item');

  burger.addEventListener('click', () => {
    if (burger.classList.contains('burger_open')) {
      burger.classList.remove('burger_open');
      burger.classList.add('burger_close');
      main.style.left = '0';
      main.style.width = '100%';
    } else {
      burger.classList.add('burger_open');
      burger.classList.remove('burger_close');
      main.style.left = '200px';
      main.style.width = 'calc(100% - 200px)';
    }

    nav.classList.toggle('nav_open');

    links.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = '';
      } else {
        link.style.animation = `linkFade 0.5s ease-in-out ${index / 6 + 0.5}s forwards`;
      }
    });
  });
};

navSlideIn();
