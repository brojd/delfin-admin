import React, {Component} from 'react';
import classNames from 'classnames';
import styles from './MainLayout.stylsheet.css';
import Header from '../../components/Header/Header.component';
import Nav from '../../components/Nav/Nav.component';
import CONFIG from '../../config';
import axios from 'axios';

class MainLayout extends Component {
  constructor() {
    super();
    this._passCompetitionId = this._passCompetitionId.bind(this);
    this._getCurrentCompetition = this._getCurrentCompetition.bind(this);
    this.state = {
      competitions: [],
      headerText: ''
    };
  }
  _passCompetitionId(id) {
    this.setState({ currentCompetitionId: id });
  }
  _getCurrentCompetition(id, array) {
    return array.filter((n) => n.id == id)[0];
  }
  componentDidMount() {
    axios.get(`${CONFIG.API_URL}/competitions`)
      .then((response) => {
        if (!localStorage.getItem('currentCompetitionId')) {
          localStorage.setItem('currentCompetitionId', response.data[0].id);
          this.setState({
            currentCompetitionId: response.data[0].id,
            competitions: response.data
          });
        } else {
          this.setState({
            currentCompetitionId: localStorage.getItem('currentCompetitionId'),
            competitions: response.data
          });
        }
      })
      .catch((error) => console.error(error));
  }
  render() {
    return (
      <div className={classNames(styles.MainLayout)}>
        <Header />
        <Nav />
        {this.props.children && React.cloneElement(this.props.children, {
          passCompetitionId: this._passCompetitionId,
          competitions: this.state.competitions,
          currentCompetitionId: this.state.currentCompetitionId
        })}
      </div>
    );
  }
}

export default MainLayout;
