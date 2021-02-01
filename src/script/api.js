import getCurrencylist from './components/settings/currencyList';
import pubsub from './pubsub';
// import pubsub from './pubsub';

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

  async setLocalStorage(userId, email, token, refreshToken) {
    Object.assign(this, { userId, email, token, refreshToken });
    localStorage.setItem('userId', userId);
    localStorage.setItem('email', email);
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    return true;
  }

  logout() {
    this.userId = null;
    this.email = null;
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  CheckCurrentUser() {
    if (this.userId && this.token && this.refreshToken) {
      return true;
    }
    return false;
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
    if (auth && (this.refreshToken)) {
      reqParams.withCredentials = true;
      reqParams.headers.Authorization = `${this.refreshToken}`;
    }
    const response = await fetch(`${this.apiUrl}${route}`, reqParams);
    if (response.ok) {
      // console.log('refresh token ok: ', response);
      return response;
    }
    // console.log('refresh token !ok: ', response);
    // this.logout();
    pubsub.publish('logout');
    return response;
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
    // console.log('this from request', this);
    if (auth && !(this.token == null)) {
      reqParams.withCredentials = true;
      reqParams.headers.Authorization = `${this.token}`;
    }
    if ((this.CheckCurrentUser() === false) && (auth === true)) {
      // pubsub.publish('navigateTo', '/login');
      return undefined;
    }
    const response = await fetch(`${this.apiUrl}${route}`, reqParams);
    // console.log('first response', response);
    if ((response.ok === false) && (this.CheckCurrentUser() === true)) {
      const result = await this.getNewTokens('POST', '/users/token', { email: this.email, userId: this.userId }, auth);
      // console.log('second response', result);
      if (!result.ok) {
        // const content = await result.json();
        // console.log('message from content', content);
        // pubsub.publish('navigateTo', '/login');
        // return content;
        return undefined;
      }
      // console.log(result);
      const content = await result.json();
      await this.setLocalStorage(
        content.userId,
        content.email,
        content.token,
        content.refreshToken,
      );
      const responseAfterRefresh = await this.request(method, route, body, auth);
      // console.log('after refresh', responseAfterRefresh);
      return responseAfterRefresh;
    }
    return response.json();
  }

  async login(email, password) {
    const result = await this.request('POST', '/users/login', { email, password }, false);
    if (result.userId && result.token && result.refreshToken && result.email) {
      const { userId, token, refreshToken } = result;
      await this.setLocalStorage(userId, email, token, refreshToken);
      return true;
    }
    // throw new Error(result.message);
    return result.message;
  }

  async registerUser(email, password) {
    const result = await this.request('POST', '/users', { email, password }, false);
    if (result.user) {
      return true;
    }
    // throw new Error(result.message);
    return result.message;
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
    const result = await this.request('GET', '/users/current');
    return result;
  }

  async updateUser(userData) {
    return this.request('PUT', '/users/current', userData);
  }
}

const api = new ApiClient('https://rsclone-coinkeeper.herokuapp.com');
// const api = new ApiClient('http://localhost:8000');

export default api;
