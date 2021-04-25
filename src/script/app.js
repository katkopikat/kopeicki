import api from './api';

class App {
  constructor(apiInstance) {
    this.api = apiInstance;
    this.user = null;
    this.transactions = null;
    this.transactionsSummary = null;
  }

  async init() {
    await this.checkAuth();
  }

  async checkAuth() {
    try {
      this.user = await this.api.getUser();
      if (this.user) {
        this.transactions = await this.getTransactions();
        document.getElementById('profile-name').textContent = this.api.email;
        document.getElementById('logout').style.opacity = 1;
      } else {
        const isLogout = this.api.checkCurrentUser();
        if (isLogout === false) {
          this.logout();
        }
        window.history.pushState(null, null, '/login');
      }
    } catch (e) {
      window.history.pushState(null, null, '/login');
    }
  }

  logout() {
    this.api.logout();
    this.user = null;
    this.transactions = null;
    this.transactionsSummary = null;
    document.getElementById('profile-name').textContent = '';
    document.getElementById('logout').style.opacity = 0;
  }

  async login(email, password) {
    try {
      const result = await this.api.login(email, password);
      if (result === true) {
        this.user = await this.api.getUser();
        this.transactions = await this.getTransactions();
        document.getElementById('profile-name').textContent = this.api.email;
        document.getElementById('logout').style.opacity = 1;
        return true;
      }
      return result;
    } catch (e) {
      throw new Error(e);
    }
  }

  async register(email, password, currency) {
    try {
      const result = await this.api.registerUser(email, password, currency);
      if (result === true) {
        await this.login(email, password);
      }
      return result;
    } catch (e) {
      throw new Error(e);
    }
  }

  async getTransactions(update = false) {
    if (!this.transactions || update) {
      this.transactions = await this.api.getTransactions();
      if (this.transactions) {
        this.calcTxsSummary(this.transactions);
      }
    }
    return this.transactions;
  }

  async saveTransaction(txData) {
    const tx = await this.api.saveTransaction(txData);
    await this.getTransactions(true);
    this.user = await this.api.getUser();
    return tx;
  }

  async deleteTransaction(txData) {
    const tx = await this.api.deleteTransaction(txData);
    await this.getTransactions(true);
    this.user = await this.api.getUser();
    return tx;
  }

  calcTxsSummary(transactions) {
    const txsByMonth = {};
    const monthKey = (date) => `${date.getFullYear()}${String(date.getMonth()).padStart(2, '0')}`;
    transactions.forEach((tx) => {
      const yearMonth = monthKey(new Date(tx.date));
      if (!txsByMonth[yearMonth]) txsByMonth[yearMonth] = [];
      txsByMonth[yearMonth].push(tx);
    });
    const txsThisMonth = txsByMonth[monthKey(new Date())] || [];
    const monthSummary = {
      expenses: new Map(),
      income: new Map(),
    };
    txsThisMonth.forEach((tx) => {
      const stat = monthSummary[tx.type] || new Map();
      stat.set(tx.category, (stat.get(tx.category) || 0) + tx.amount);
    });
    Object.assign(monthSummary, {
      expensesTotal: [...monthSummary.expenses.values()].reduce((acc, x) => acc + x, 0),
      incomeTotal: [...monthSummary.income.values()].reduce((acc, x) => acc + x, 0),
    });
    this.transactionsSummary = monthSummary;
  }

  getAccountsTotal() {
    const accounts = this.user?.accounts || [];
    return accounts.reduce((total, acc) => total + Number(acc.amount || 0), 0);
  }

  getUserAccounts() {
    return this.user.accounts;
  }

  getUserExpenses() {
    return this.user.expenses;
  }

  getUserIncome() {
    return this.user.income;
  }

  async addUserAccount(acc) {
    this.user.accounts.push(acc);
    this.user = await this.api.updateUser(this.user);
  }

  async addUserExpense(exp) {
    this.user.expenses.push(exp);
    this.user = await this.api.updateUser(this.user);
  }

  async addUserIncome(inc) {
    this.user.income.push(inc);
    this.user = await this.api.updateUser(this.user);
  }

  async removeUserAccount(account) {
    this.user.accounts = this.user.accounts.filter((item) => item.name !== account);
    this.user = await this.api.updateUser(this.user);
  }

  async removeUserExpense(expense) {
    this.user.expenses = this.user.expenses.filter((item) => item.name !== expense);
    this.user = await this.api.updateUser(this.user);
  }

  async removeUserIncome(income) {
    this.user.income = this.user.income.filter((item) => item.name !== income);
    this.user = await this.api.updateUser(this.user);
  }
}

const app = new App(api);

export default app;
