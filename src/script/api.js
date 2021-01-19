class ApiClient {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.userId = localStorage.getItem('userId');
    this.token = localStorage.getItem('token');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  // handleError(res) {
  //   if (!res.ok) {
  //     throw new Error(res.error);
  //   }
  //   return res;
  // }

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

  async getNewTokens(method = 'GET', route = '/users/token', body = false, auth = true) {
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
    return response;
  }

  // async request(method, route, body = false, auth = true) {
  //   const isAuth = this.checkAuthorization();
  //   if (!isAuth) {
  //     return false;
  //   }
  //   const reqParams = {
  //     method: `${method}`,
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //   };
  //   console.log(this.userId);
  //   console.log(this.token);
  //   console.log(this.refreshToken);
  //   if (body) {
  //     reqParams.body = JSON.stringify(body);
  //   }
  //   if (auth && this.token) {
  //     reqParams.withCredentials = true;
  //     reqParams.headers.Authorization = `${this.token}`; // `Bearer ${this.token}`
  //   }
  //   const response = await fetch(`${this.apiUrl}${route}`, reqParams);
  //   if (response.status === 401 || response.status === 403) {
  //     const { checkUserId } = this.userId;
  //     const secondResponse = await this.getNewTokens('GET', '/users/token',
  //  { undefined, checkUserId });
  //     if (secondResponse.status === 401 || secondResponse.status === 403) {
  //       console.log('redirect to login-register page');
  //     } else {
  //       const {
  //         userId,
  //         email,
  //         token,
  //         refreshToken,
  //       } = secondResponse.json();
  //       Object.assign(this, { userId, email, token, refreshToken });
  //       localStorage.setItem('userId', userId);
  //       localStorage.setItem('email', email);
  //       localStorage.setItem('token', token);
  //       localStorage.setItem('refreshToken', refreshToken);
  //       console.log(secondResponse);
  //     }
  //   }
  //   if (!response.ok) {
  //     throw new Error(response.error);
  //   }
  //   return response.json();
  // }

  // async getNewTokens(method, route, body = false, auth = true) {
  //   const reqParams = {
  //     method: `${method}`,
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //   };
  //   if (body) {
  //     reqParams.body = JSON.stringify(body);
  //   }
  //   if (auth && this.token && (route !== '/users/token')) {
  //     reqParams.withCredentials = true;
  //     reqParams.headers.Authorization = `${this.token}`; // `Bearer ${this.token}`
  //   } else if (auth && this.refreshToken && (route === '/users/token')) {
  //     reqParams.withCredentials = true;
  //     reqParams.headers.Authorization = `${this.refreshToken}`;
  //   }
  //   const response = await fetch(`${this.apiUrl}${route}`, reqParams);
  //   console.log(response);
  //   if ((route === '/users/token') && (response.status !== 200)) {
  //     console.log('go to login-register page');
  //   }
  //   return response.json();
  // }

  async request(method, route, body = false, auth = true) {
    const isAuth = this.checkAuthorization();
    if (!isAuth) return undefined;
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
    // const response = await fetch(`${this.apiUrl}${route}`, reqParams);
    const response = await fetch(`${this.apiUrl}${route}`, reqParams);
    // .then((res) => (res.ok ? res : Promise.reject(res)))
    // .then((data) => console.log('+', data))
    // .catch(() => console.log('some error'));
    // .then((res) => {
    // if (!res.ok) {
    //   console.log(res);
    //   console.log(res.json());
    //   return Promise.reject(res);
    // throw new Error(res.statusText);
    // return res.json();
    // }
    // return res.json();
    // })
    // .then((res) => {
    //   console.log('2then', res);
    //   return res.json();
    // })
    // .catch((err) => console.log(err));
    // if (!response.ok) {
    //   throw new Error(response.error);
    // }
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
    // try {
    const response = this.request('GET', '/transactions');
    return response;
    // } catch (e) {
    //   console.error(e.message);
    //   return null;
    //   // e.message;
    // }
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
}

// const api = new ApiClient('https://rsclone-coinkeeper.herokuapp.com'); // 'http://localhost:8000'
const api = new ApiClient('http://localhost:8000'); // 'http://localhost:8000'

export default api;
