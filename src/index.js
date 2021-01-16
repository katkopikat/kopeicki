import './styles/main.scss';

import Transactions from './script/components/transactions/transactions';
import Settings from './script/components/settings/settings';

const Statistics = () => {
  console.log('I am a statistics page!');
};
const Planning = () => {
  console.log('I am a planning page!');
};

const router = () => {
  const routes = [
    { path: '/statistics', component: Statistics },
    { path: '/planning', component: Planning },
    { path: '/settings', component: Settings },
    { path: '/', component: Transactions },
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
