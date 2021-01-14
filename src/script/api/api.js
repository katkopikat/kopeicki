class ApiClient {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.userId = localStorage.getItem('userId');
    this.token = localStorage.getItem('token');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  async request(method, route, body = false, auth = false) {
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
    const result = await this.request('POST', '/users/login', { email, password });
    const { userId, token, refreshToken } = result;
    if (userId) {
      Object.assign(this, { userId, token, refreshToken });
      localStorage.setItem('userId', userId);
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      console.log('login success');
      return true;
    }
    console.log(result.message);
    return false;
  }

  async saveTransaction(tx) {
    return this.request('POST', '/transactions', tx, true);
  }
}

export default ApiClient;
