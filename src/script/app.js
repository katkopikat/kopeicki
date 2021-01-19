import api from './api';
import createElement from './utils/create';
// import renderAuthorizationPage from './components/authorization/authorization';

class App {
  constructor(apiInstance) {
    this.api = apiInstance;
    this.loggedIn = false;
    this.transactions = [];
  }

  // async init() {
  //   // dev mode autologin
  //   await this.login();
  // }

  // async checkAuth() {
  //   const userId = localStorage.getItem('userId');
  //   const token = localStorage.getItem('token');
  //   const refreshToken = localStorage.getItem('refreshToken');
  //   if (userId === null
  //     || token === null
  //     || refreshToken === null) {
  //     this.loggedIn = false;
  //     // redirect to login-register page
  //     window.history.pushState(null, null, '/users/login');
  //   }
  // }

  async login(email, password) {
    try {
      // await this.api.login('user1@rsclone.com', 'test');
      await this.api.login(email, password);
      this.loggedIn = true;
      console.log('login success');
    } catch (e) {
      console.error(e.message);
    }
  }

  async renderHistory() {
    const history = document.querySelector('.transactions-history');
    this.transactions = await this.api.getTransactions();
    console.log(`totalTxs: ${Object.keys(this.transactions).length}`);
    this.transactions.forEach((tx) => {
      const delBtn = createElement('a', '', 'x');
      // eslint-disable-next-line no-script-url
      delBtn.setAttribute('href', 'javascript:');
      delBtn.addEventListener('click', async () => {
        console.log(`delete tx: ${tx.id}`);
        await this.api.deleteTransaction(tx.id);
        this.renderHistory();
      });
      let txEl;
      if (tx.type === 'expenses') {
        txEl = createElement('div', '', [`${tx.account} > ${tx.category} : ${tx.amount}р `, delBtn]);
      } else {
        txEl = createElement('div', '', [`${tx.category} > ${tx.account} : ${tx.amount}р `, delBtn]);
      }
      history.append(txEl);
    });
  }
}

const app = new App(api);

// app.init();

export default app;
