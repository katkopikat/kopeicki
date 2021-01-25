import api from './api';

class App {
  constructor(apiInstance) {
    this.api = apiInstance;
    this.user = null;
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
