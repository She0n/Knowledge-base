import store from '@/store/index.js'
import querystring from 'query-string'

class http {

  token = null;
  refresh = null;
  commonLink = null;
  inited = false;

  constructor() {
    this.init();
  }

  init() {
    if(this.inited) { return; }
    this.commonLink = window.config.protocol + window.config.server;
    $.ajaxSetup({
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json, text/plain, */*',
      },
    });
    this.inited = 1;
  }

  getHeaders(additional) {
    let headers = { token: localStorage.getItem('token') };
    if(additional.headers) {
      Object.assign(headers, additional.headers);
      delete additional.headers;
    }
    return headers;
  }


  async post(link, opts = {}, additional = {}) {
    let result;
    let baseAdditional = Object.assign({}, additional);
    let file = additional.file;
    delete additional.file;
    let queryObject = {
      type: 'POST',
      url: this.commonLink + link,
      headers: this.getHeaders(additional),
      data: file ? opts : JSON.stringify(opts)
    };
    Object.assign(queryObject, additional);
    if(file) {
      Object.assign(queryObject, {   processData: false, cache: false, contentType: false });
    }
    try {
      result = await $.ajax(queryObject);
      return result;
    } catch(e) {
      if(e.responseJSON) {
        if(e.responseJSON.error === "Token expired!") {
          let tokenRefresh = await this.refreshToken();
          if(!tokenRefresh) {
            store.dispatch('logout');
            return null;
          }
          result = await this.post(link, opts, baseAdditional);
          return result;
        }
      }
      return null;
    }
  };

  async get(link, opts, additional = {}) {
    let result;
    if(opts) {
      link += '?' + querystring.stringify(opts);
    }
    let baseAdditional = Object.assign({}, additional);
    let queryObject = {
      type: 'GET',
      url: this.commonLink + link,
      headers: this.getHeaders(additional),
    };
    Object.assign(queryObject, additional);
    try {
      result = await $.ajax(queryObject);
      return result;
    } catch(e) {
      if(e.responseJSON) {
        if(e.responseJSON.error === "Token expired!") {
          let tokenRefresh = await this.refreshToken();
          if(!tokenRefresh) {
            store.dispatch('logout');
            return null;
          }
          additional.token = tokenRefresh.token;
          result = await this.get(link, opts, baseAdditional);
          return result;
        } else {
          if(e.status === 401) {
            store.dispatch('logout');
          }
        }
      }
      return null;
    }
  };

  async refreshToken() {
    let result;
    let customHeaders = {
      refresh: localStorage.getItem('refresh')
    };
    try {
      result = await $.ajax({
        type: 'POST',
        url: this.commonLink + '/api/refresh-tokens',
        headers: customHeaders
      });
      if(result.token && result.refresh) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('refresh', result.refresh);
      } else {
        store.dispatch('logout');
        return false;
      }
      return result;
    } catch(e) {
      store.dispatch('logout');
      return null;
    }
  }
};

const httpClient = new http();

window.$http = httpClient;
window.querystring = querystring;
