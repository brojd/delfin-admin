import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import styles from'./Header.stylesheet.css';
import {Link} from 'react-router';
import auth from '../../auth';
import logo from './logo.png';

class Header extends Component {
  constructor() {
    super();
    this._updateAuth = this._updateAuth.bind(this);
    this.state = {
      loggedIn: auth.loggedIn()
    };
  }
  _updateAuth(loggedIn) {
    this.setState({
      loggedIn
    });
  }
  componentWillMount() {
    auth.onChange = this._updateAuth;
    auth.login();
  }
  render() {
    return (
      <header className={classNames(styles.Header)}>
        <div className={classNames('uk-width-1-6', styles.logoWrapper)}>
          <img src={logo}
               alt='logo' className={styles.logoWrapper_logo} />
        </div>
        <div className='uk-width-5-6 uk-float-right uk-text-center'>
          {this.state.loggedIn ? (
            <span>
              <Link to='/logout' className={classNames(styles.log, 'uk-float-right')}>
                <i className='uk-icon-sign-out uk-icon-small uk-margin-small-right'></i>Wyloguj się
              </Link>
              <span className={classNames(styles.companyName, 'uk-float-right')}>
                Krapkowicka Pływalnia "Delfin" Sp. z o. o.
              </span>
            </span>
          ) : (
            <Link to='/login' className={classNames(styles.log, 'uk-float-right')}>
              <i className='uk-icon-sign-in uk-icon-small uk-margin-small-right'></i>Zaloguj się
            </Link>
          )}
          <h2 className={classNames(styles.Header__heading, 'uk-text-center')}>
            {this.props.textToDisplay}
          </h2>
        </div>
      </header>
    );
  }
}

Header.defaultProps = {
  currentCompetition: {
    name: 'Zawody'
  }
};

Header.propTypes = {
  currentCompetition: PropTypes.object
};

export default Header;
