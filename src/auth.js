import axios from 'axios';
import CONFIG from './config';

module.exports = {
  login(email, pass, cb) {
    let obj = {
      'email': email,
      'password': pass
    };
    cb = arguments[arguments.length - 1];
    if (localStorage.token) {
      if (cb) cb(true);
      this.onChange(true);
      return;
    }
    axios.post(`${CONFIG.API_URL}/Users/login`, obj)
      .then((res) => {
        localStorage.token = res.data.id;
        if (cb) cb(true);
        this.onChange(true);
      })
      .catch((err) => {
        console.error(err);
        if (cb) cb(false);
      });
  },
  getToken() {
    return localStorage.token;
  },
  logout(cb) {
    delete localStorage.token;
    delete localStorage.currentCompetitionId;
    if (cb) cb();
    this.onChange(false);
  },
  loggedIn() {
    return !!localStorage.token;
  },
  onChange() {}
};
