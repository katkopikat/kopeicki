import getCurrencylist from './components/settings/currency_list';

class ApiClient {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.userId = localStorage.getItem('userId');
    this.token = localStorage.getItem('token');
    this.refreshToken = localStorage.getItem('refreshToken');
    this.currencyList = this.getCurrencylist();
  }

  async getCurrencylist() {
    this.currencyList = await getCurrencylist();
    this.currencyList = this.currencyList.sort();
  }

  async request(method, route, body = false, auth = true) {
    const reqParams = {
      method: `${method}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    if (body) {
      reqParams.body = JSON.stringify(body);
    }
    if (auth && this.token) {
      reqParams.withCredentials = true;
      reqParams.headers.Authorization = `${this.token}`; // `Bearer ${this.token}`
    }
    const response = await fetch(`${this.apiUrl}${route}`, reqParams);
    return response.json();
  }

  async login(email, password) {
    const result = await this.request('POST', '/users/login', { email, password }, false);
    const { userId, token, refreshToken } = result;
    if (userId) {
      Object.assign(this, { userId, token, refreshToken });
      localStorage.setItem('userId', userId);
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      return true;
    }
    throw new Error(result.message);
  }

  async registerUser(email, password) {
    const result = await this.request('POST', '/users', { email, password }, false);
    if (result.id) {
      return true;
    }
    throw new Error(result.message);
  }

  async getTransactions(/* todo filter */) {
    return this.request('GET', '/transactions');
  }

  async getTransaction(txId) {
    return this.request('GET', `/transactions/${txId}`);
  }

  async saveTransaction(txData) {
    return this.request('POST', '/transactions', txData);
  }

  async updateTransaction(txId, txData) {
    return this.request('PUT', `/transactions/${txId}`, txData);
  }

  async deleteTransaction(txId) {
    return this.request('DELETE', `/transactions/${txId}`);
  }

  async getUser() {
    return this.request('GET', '/users/current');
  }

  async updateUser(userData) {
    return this.request('PUT', '/users/current', userData);
  }
}

const api = new ApiClient('https://rsclone-coinkeeper.herokuapp.com'); // 'http://localhost:8000'

export default api;