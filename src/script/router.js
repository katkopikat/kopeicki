import renderAuthorizationPage from './components/authorization/authorization';
import renderHistoryPage from './components/history/tableHistory';
import renderStatisticsPage from './components/statistics/statistics';
import renderTransactionsPage from './components/transactions/transactions';

function activeNavLink() {
  document.querySelectorAll('.nav__link').forEach((el) => {
    el.classList.remove('active');

    if (el.href === window.location.href) {
      el.classList.add('active');
    }
  });
}

const router = () => {
  const routes = [
    { path: '/statistics', component: renderStatisticsPage },
    { path: '/history', component: renderHistoryPage },
    { path: '/login', component: renderAuthorizationPage },
    { path: '/', component: renderTransactionsPage },
  ];

  const path = window.location.href;

  const match = routes.find((r) => path.includes(r.path));

  activeNavLink();

  document.querySelector('main').innerHTML = '';

  match.component();
};

export default router;
