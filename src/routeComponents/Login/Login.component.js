import React, {Component} from 'react';
import auth from '../../auth';
import classNames from 'classnames';
import styles from './Login.stylesheet.css';

class Login extends Component {
  constructor() {
    super();
    this._handleEmailChange = this._handleEmailChange.bind(this);
    this._handlePassChange = this._handlePassChange.bind(this);
    this._handleLogin = this._handleLogin.bind(this);
    this.state = {
      email: '',
      pass: '',
      error: false
    };
  }
  _handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }
  _handlePassChange(e) {
    this.setState({ pass: e.target.value });
  }
  _handleLogin() {
    auth.login(this.state.email, this.state.pass, (loggedIn) => {
      if (loggedIn) {
        this.props.history.push('/');
      } else {
        this.setState({ error: true });
      }
    });
  }
  render() {
    let errorMessage = this.state.error ? <div>Error</div> : '';
    return (
      <form className='uk-form uk-align-center uk-width-3-10 uk-margin-large-top'>
        <fieldset>
          <div className='uk-form-row'>
            E-mail <input type='text'
                           value={this.state.email}
                           onChange={this._handleEmailChange}
                           className='uk-float-right uk-width-7-10' />
          </div>
          <div className='uk-form-row'>
            Password <input type='password'
                            value={this.state.pass}
                            onChange={this._handlePassChange}
                            className='uk-float-right uk-width-7-10' />
          </div>
          <div className='uk-form-row'>
            <button type='button'
                    onClick={this._handleLogin}
                    className={classNames(styles.loginButton, 'uk-button uk-align-center')}>
              Login
            </button>
          </div>
        </fieldset>
        {errorMessage}
      </form>
    );
  }
}

export default Login;
