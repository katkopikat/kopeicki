import './styles/main.scss';
import 'bootstrap';

import renderAuthorizationPage from './script/components/authorization/authorization';
import toggleSettings from './script/components/settings/settings';
import renderHistoryPage from './script/components/history/history';
import renderStatisticsPage from './script/components/statistics/statistics';
import renderTransactionsPage from './script/components/transactions/transactions';
import navSlideIn from './script/components/navbar';
import app from './script/app';
import pubsub from './script/pubsub';

const router = () => {
  const routes = [
    { path: '/statistics', component: renderStatisticsPage },
    { path: '/history', component: renderHistoryPage },
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
  // if (app.user) {
  window.history.pushState(null, null, url);
  router();
  // }
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

  pubsub.subscribe('navigateTo', navigateTo);
  app.init().then(router);
  // router();
});

/* ------------ HOT KEYS ---------------
      Alt + T --> Open transactions page
      Alt + S --> Open settings page
      Alt + H --> Open history page
  */

function hotKeys() {
  let keysPushead = [];

  window.addEventListener('keydown', (e) => {
    keysPushead.push(e.target);

    if (keysPushead.length === 2) {
      if (e.altKey && e.keyCode === 84) {
        e.preventDefault();
        navigateTo('/');
      }
      if (e.altKey && e.keyCode === 83) {
        e.preventDefault();
        navigateTo('/statistics');
      }
      if (e.altKey && e.keyCode === 72) {
        e.preventDefault();
        navigateTo('/history');
      }
      keysPushead = [];
    }
  });
}

hotKeys();
navSlideIn();
