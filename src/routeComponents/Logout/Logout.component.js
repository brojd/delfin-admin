import React, {Component} from 'react';
import auth from '../../auth';

class Logout extends Component {
  componentDidMount() {
    auth.logout();
  }
  render() {
    return (
      <div className='uk-alert uk-align-center uk-text-center uk-width-5-10 uk-margin-large-top'>
        Zostałeś wylogowany
      </div>
    );
  }
}

export default Logout;
