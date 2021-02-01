import './styles/main.scss';
import 'bootstrap';

import router from './script/router';
import toggleSettings from './script/components/settings/settings';
import navSlideIn from './script/components/navbar';
import app from './script/app';
import pubsub from './script/pubsub';
import hotKeys from './script/utils/hotKeys';
import './assets/images/favicon.png';

const navigateTo = (url) => {
  if (app.user || url.includes('login')) {
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

  pubsub.subscribe('navigateTo', navigateTo);

  app.init().then(router);
});

document.getElementById('logout').addEventListener('click', (e) => {
  e.preventDefault();
  app.logout();
  navigateTo('/login');
});

pubsub.subscribe('logout', () => app.logout);

hotKeys();
navSlideIn();
