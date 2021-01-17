import api from './api';
import createElement from './utils/create';

class App {
  constructor() {
    this.loggedIn = false;
    this.transactions = [];
  }

  async init() {
    // dev mode autologin
    await this.login();
    this.renderHistory();
  }

  async login() {
    try {
      await api.login('user1@rsclone.com', 'test');
      this.loggedIn = true;
      console.log('login success');
    } catch (e) {
      console.error(e.message);
    }
  }

  async renderHistory() {
    const history = document.querySelector('.transactions-history');
    this.transactions = await api.getTransactions();
    history.innerHTML = '';
    console.log(`totalTxs: ${Object.keys(this.transactions).length}`);
    this.transactions.forEach((tx) => {
      const delBtn = createElement('a', '', 'x');
      // eslint-disable-next-line no-script-url
      delBtn.setAttribute('href', 'javascript:');
      delBtn.addEventListener('click', async () => {
        console.log(`delete tx: ${tx.id}`);
        await api.deleteTransaction(tx.id);
        this.renderHistory();
      });
      let txEl;
      if (tx.type === 'expenses') {
        txEl = createElement('div', '', [
          `${tx.account} > ${tx.category} : ${tx.amount}р `,
          delBtn,
        ]);
      } else {
        txEl = createElement('div', '', [
          `${tx.category} > ${tx.account} : ${tx.amount}р `,
          delBtn,
        ]);
      }
      history.append(txEl);
    });
  }
}

const app = new App();

app.init();

export default app;
