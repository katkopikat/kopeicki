import getCurrencylist from './components/settings/currency_list';

class ApiClient {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.userId = localStorage.getItem('userId');
    this.email = localStorage.getItem('email');
    this.token = localStorage.getItem('token');
    this.refreshToken = localStorage.getItem('refreshToken');
    this.currencyList = this.getCurrencylist();
  }

  async getCurrencylist() {
    this.currencyList = await getCurrencylist();
    this.currencyList = this.currencyList.sort();
  }

  setLocalStorage(userId, email, token, refreshToken) {
    Object.assign(this, { userId, email, token, refreshToken });
    localStorage.setItem('userId', userId);
    localStorage.setItem('email', email);
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    return true;
  }

  checkAuthorization() {
    console.log(this.apiUrl);
    if (this.userId === null || this.token === null || this.refreshToken === null) {
      console.log('Authorization error, change route to login');
      window.history.pushState(null, null, '/login');
      return undefined;
      // return { message: 'invalid autorization' };
    }
    return true;
  }

  async getNewTokens(method = 'POST', route = '/users/token', body = false, auth = true) {
    const reqParams = {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    if (body) {
      reqParams.body = JSON.stringify(body);
    }
    if (auth && this.refreshToken) {
      reqParams.withCredentials = true;
      reqParams.headers.Authorization = `${this.refreshToken}`;
    }
    const response = await fetch(`${this.apiUrl}${route}`, reqParams);
    if (response.ok) {
      console.log(response);
      return response.json();
    }
    console.log(response);
    return undefined;
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
    console.log(response);
    if (!response.ok) {
      const result = await this.getNewTokens('POST', '/users/token', { email: this.email, userId: this.userId });
      console.log(result);
      if (!result) {
        console.log('Authorization error, change route to login');
        window.history.pushState(null, null, '/login');
        return undefined;
      }
      this.setLocalStorage(result.userId, result.email, result.token, result.refreshToken);
      const responseAfterRefresh = await this.request(method, route, body, auth);
      console.log('after refresh', responseAfterRefresh);
      return responseAfterRefresh;
    }
    return response.json();
  }

  async login(email, password) {
    const result = await this.request('POST', '/users/login', { email, password }, false);
    const { userId, token, refreshToken } = result;
    if (userId) {
      this.setLocalStorage(userId, email, token, refreshToken);
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
// const api = new ApiClient('http://localhost:8000'); // 'http://localhost:8000'

export default api;