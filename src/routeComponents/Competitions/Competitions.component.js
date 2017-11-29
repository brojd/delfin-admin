import React, {Component, PropTypes} from 'react';
import SwimmersList from '../../components/SwimmersList/SwimmersList.component';
import ChooseCompetition from '../../components/ChooseCompetition/ChooseCompetition.component';
import classNames from 'classnames';
import styles from './Competitions.stylesheet.css';
import Select from 'react-select';
import axios from 'axios';
import CONFIG from '../../config';
import CompetitionSettings from '../../components/CompetitionSettings/CompetitionSettings.component';
import auth from '../../auth';

class Competitions extends Component {
  constructor() {
    super();
    this._setCurrentCompetition = this._setCurrentCompetition.bind(this);
    this._handleSwimmerChosen = this._handleSwimmerChosen.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
    this.state = {
      competitions: [],
      allSwimmers: [],
      competitionSwimmers: [],
      currentCompetition: {}
    };
  }
  _setCurrentCompetition(e, id) {
    let currentCompetition = this.state.competitions.filter((n) => n.id === id)[0];
    localStorage.setItem('currentCompetitionId', id);
    axios.get(`${CONFIG.API_URL}/competitions/${id}/swimmers`)
      .then((competitionSwimmers) => this.setState({ competitionSwimmers: competitionSwimmers.data,
        currentCompetition: currentCompetition }));
  }
  _handleSwimmerChosen(val) {
    axios.head(`${CONFIG.API_URL}/competitions/${localStorage.getItem('currentCompetitionId')}/swimmers/rel/${val.value.id}?access_token=${auth.getToken()}`)
      .then((res) => {
        if (res.status === 200) {
          alert('Swimmer already added');
        }
      })
      .catch(() => {
        let competitionSwimmers = this.state.competitionSwimmers;
        competitionSwimmers.push(val.value);
        axios.put(`${CONFIG.API_URL}/competitions/${localStorage.getItem('currentCompetitionId')}/swimmers/rel/${val.value.id}?access_token=${auth.getToken()}`)
          .then(() => this.setState({ competitionSwimmers: competitionSwimmers }))
          .catch((err) => { console.error(err); this.props.history.push('/logout'); });
      });
  }
  _handleDelete(id) {
    axios.delete(`${CONFIG.API_URL}/competitions/${localStorage.getItem('currentCompetitionId')}/swimmers/rel/${id}?access_token=${auth.getToken()}`)
      .then((res) => {
        if (res.status === 204) {
          let competitionSwimmers = this.state.competitionSwimmers.filter((n) => n.id !== id);
          this.setState({ competitionSwimmers: competitionSwimmers });
        }
      })
      .catch((error) => { console.error(error); this.props.history.push('/logout'); });
  }
  _getCurrentSchoolName(swimmerId) {
    if (this.state.allSwimmers.length > 0 && this.state.allSchools.length > 0) {
      let currentSwimmer = this.state.allSwimmers.filter((n) => n.id === swimmerId)[0];
      let currentSchool = this.state.allSchools.filter((n) => n.id === currentSwimmer.schoolId)[0];
      return currentSchool.name;
    }
    return null;
  }
  componentDidMount() {
    axios.all([
      axios.get(`${CONFIG.API_URL}/swimmers`),
      axios.get(`${CONFIG.API_URL}/schools`),
      axios.get(`${CONFIG.API_URL}/competitions`)
    ])
      .then(axios.spread((swimmersRes, schoolsRes, competitionsRes) => {
        let currentCompetitionId = localStorage.currentCompetitionId || competitionsRes.data[0].id;
        if (currentCompetitionId) {
          axios.get(`${CONFIG.API_URL}/competitions/${currentCompetitionId}/swimmers`)
            .then(competitionSwimmers => {
              this.setState({
                allSwimmers: swimmersRes.data,
                competitionSwimmers: competitionSwimmers.data,
                allSchools: schoolsRes.data,
                competitions: competitionsRes.data,
                currentCompetition: competitionsRes.data.filter((n) => n.id === currentCompetitionId)[0],
                currentCompetitionId: currentCompetitionId
              });
            })
            .catch((error) => console.error(error));
        }
      }))
      .catch((error) => console.error(error));
  }
  render() {
    let swimmerChoices = this.state.allSwimmers.map((n) => {
      return {
        value: n,
        label: `${n.name} ${n.surname} (${this._getCurrentSchoolName(n.id)})`
      };
    });
    return (
      <div className={classNames('uk-align-center uk-width-9-10', styles.Competitions)}>
        <h3 className='uk-text-center '>
          Wybierz zawody
        </h3>
        <ChooseCompetition competitions={this.state.competitions}
                           currentCompetitionId={this.state.currentCompetition.id}
                           competitionChanged={this.props.competitionChanged}
                           setCurrentCompetition={this._setCurrentCompetition} />
        <h3 className='uk-text-center '>
          Lista uczestników
        </h3>
        <Select
          name='swimmer'
          options={swimmerChoices}
          onChange={this._handleSwimmerChosen}
          className='uk-width-2-10 uk-align-center' />
        <SwimmersList swimmers={this.state.competitionSwimmers}
                      deleteSwimmer={this._handleDelete}
                      schools={this.state.allSchools}
                      editable={false} />
        <h3 className='uk-text-center '>
          Ustawienia zawodów
        </h3>
        <CompetitionSettings currentCompetition={this.state.currentCompetition} />
      </div>
    );
  }
}

Competitions.propTypes = {
  competitionChanged: PropTypes.func,
  competitions: PropTypes.array,
};

export default Competitions;
