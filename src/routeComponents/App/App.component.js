import React, {Component} from 'react';
import Main from '../Main/Main.component';
import { Router, Route } from 'react-router';
import Competitions from '../Competitions/Competitions.component';
import Swimmers from '../Swimmers/Swimmers.component';
import Times from '../Times/Times.component';
import Classifications from '../Classifications/Classifications.component';
import Schools from '../Schools/Schools.component';
import MainLayout from '../MainLayout/MainLayout.component';
import GeneralRankings from '../GeneralRankings/GeneralRankings.component';
import Records from '../Records/Records.component';
import Login from '../Login/Login.component';
import Logout from '../Logout/Logout.component';
import auth from '../../auth';

class App extends Component {

  requireAuth(nextState, replace) {
    if (!auth.loggedIn()) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      });
    }
  }

  render() {
    return (
      <Router>
        <Route component={MainLayout}>
          <Route component={Main}>
            <Route path='/' component={Competitions} onEnter={this.requireAuth}/>
            <Route path='/login' component={Login} />
            <Route path='/logout' component={Logout} />
            <Route path='/swimmers' component={Swimmers} onEnter={this.requireAuth}/>
            <Route path='/times' component={Times} onEnter={this.requireAuth}/>
            <Route path='/classifications' component={Classifications} onEnter={this.requireAuth}/>
            <Route path='/schools' component={Schools} onEnter={this.requireAuth}/>
            <Route path='/general-rankings' component={GeneralRankings} onEnter={this.requireAuth}/>
            <Route path='/records' component={Records} onEnter={this.requireAuth}/>
          </Route>
        </Route>
      </Router>
    );
  }
}

export default App;
