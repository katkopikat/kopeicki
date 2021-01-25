import api from './api';

class App {
  constructor(apiInstance) {
    this.api = apiInstance;
    this.user = null;
    this.transactions = null;
    this.transactionsSummary = null;
  }

  async init() {
    // dev mode autologin
    // await this.login();
    await this.checkAuth();
    console.log('from init: ', this.user);
  }

  async checkAuth() {
    try {
      this.user = await this.api.getUser();
    } catch (e) {
      console.error(e.message);
    }
  }

  async login(/* email, password */) {
    try {
      await this.api.login('user2@rsclone.com', 'test');
      // await this.api.login(email, password);
      this.user = await this.api.getUser();
      console.log(this.user);
      console.log('login success');
    } catch (e) {
      console.error(e.message);
    }
  }

  async getTransactions(update = false) {
    if (!this.transactions || update) {
      this.transactions = await this.api.getTransactions();
      this.calcTxsSummary(this.transactions);
    }
    return this.transactions;
  }

  async saveTransaction(txData) {
    const tx = await this.api.saveTransaction(txData);
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
    console.log('months: ', Object.keys(txsByMonth));
    const txsThisMonth = txsByMonth[monthKey(new Date())];
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
    console.log('this month: ', monthSummary);
    this.transactionsSummary = monthSummary;
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
    this.user.accounts = this.user.accounts.filter((item) => item.name !== account.name);
    this.user = await this.api.updateUser(this.user);
  }

  async removeUserExpense(expense) {
    this.user.expenses = this.user.expenses.filter((item) => item.name !== expense.name);
    this.user = await this.api.updateUser(this.user);
  }

  async removeUserIncome(income) {
    this.user.income = this.user.income.filter((item) => item.name !== income.name);
    this.user = await this.api.updateUser(this.user);
  }
}

const app = new App(api);

// app.init();

export default app;
