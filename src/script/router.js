import renderAuthorizationPage from './components/authorization/authorization';
import renderHistoryPage from './components/history/history';
import renderStatisticsPage from './components/statistics/statistics';
import renderTransactionsPage from './components/transactions/transactions';

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

  match.component();
};

export default router;
