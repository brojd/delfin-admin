import React, {Component} from 'react';
import ChooseRace from '../../components/ChooseRace/ChooseRace.component';
import RaceSwimmersList from '../../components/RaceSwimmersList/RaceSwimmersList.component';
import axios from 'axios';
import CONFIG from '../../config';
import Select from 'react-select';
import _remove from 'lodash/remove';
import _uniqBy from 'lodash/uniqBy';
import getRaceIdByCategory from '../../helpers/getRaceIdByCategory';
import getRaceTimeInCompetition from '../../helpers/getRaceTimeInCompetition';
import isSwimmerRanked from '../../helpers/isSwimmerRanked';
import auth from '../../auth';

class Times extends Component {
  constructor() {
    super();
    this._getRaceSwimmers = this._getRaceSwimmers.bind(this);
    this._getCategory = this._getCategory.bind(this);
    this._handleSwimmerChosen = this._handleSwimmerChosen.bind(this);
    this._deleteSwimmer = this._deleteSwimmer.bind(this);
    this._saveTime = this._saveTime.bind(this);
    this._updateRaceId = this._updateRaceId.bind(this);
    this._saveSwimmersPoints = this._saveSwimmersPoints.bind(this);
    this.state = {
      raceId: 1,
      competitionSwimmers: [],
      raceSwimmers: []
    };
  }
  _getRaceSwimmers(swimmers, raceId, competitionId) {
    return swimmers.filter((swimmer) => {
      let swimmerTimes = swimmer.times.filter(time =>
        time.raceId == raceId &&
        time.competitionId == competitionId
      );
      return swimmerTimes.length > 0;
    });
  }
  _updateRaceId(raceId) {
    let competitionId = this.props.currentCompetitionId;
    // let raceSwimmers = this.state.competitionSwimmers.filter((n) => n.raceIds.includes(raceId));
    let raceSwimmers = this._getRaceSwimmers(this.state.competitionSwimmers, raceId, competitionId);
    let sortedSwimmers = raceSwimmers.sort((a, b) =>
      getRaceTimeInCompetition(a, raceId, competitionId) - getRaceTimeInCompetition(b, raceId, competitionId)
    );
    this.setState({
      raceId: raceId,
      raceSwimmers: sortedSwimmers
    });
  }
  _getCategory(sex, style, age) {
    let currentId = getRaceIdByCategory(sex, style, age);
    this._updateRaceId(currentId);
  }
  _getRaceTime(swimmer, raceId) {
    let timeObj = swimmer.times.filter(
      (n) => n.raceId === raceId && n.competitionId == this.props.currentCompetitionId
    );
    if (timeObj.length > 0) {
      return Number(timeObj[0].time);
    }
    return 0;
  }
  _saveSwimmersPoints(raceId) {
    let competitionId = this.props.currentCompetitionId;
    let raceSwimmers = this.state.raceSwimmers.filter((swimmer) => {
      return isSwimmerRanked(swimmer, this.state.competitionSchools);
    });
    let ranks = this.state.competitions.filter((n) => n.id === this.props.currentCompetitionId)[0].ranks;
    let sortedSwimmers = raceSwimmers.sort((a, b) =>
      getRaceTimeInCompetition(a, raceId, competitionId) - getRaceTimeInCompetition(b, raceId, competitionId)
    );
    sortedSwimmers.forEach((swimmer, i) => {
      swimmer.times.forEach(
        (n, index) => {
          if (n.raceId === raceId && n.competitionId == this.props.currentCompetitionId) {
            if (swimmer.times[index].time > 0) {
              if (i > 10) {
                swimmer.times[index].points = Number(ranks[11].points);
                swimmer.times[index].place = i + 1;
              } else if (i > 0 && this._getRaceTime(swimmer, raceId) === this._getRaceTime(sortedSwimmers[i-1], raceId)) {
                swimmer.times[index].points = Number(ranks[i].points);
                swimmer.times[index].place = i;
              } else {
                swimmer.times[index].points = Number(ranks[i + 1].points);
                swimmer.times[index].place = i + 1;
              }
            }
          }
        }
      );
    });
    axios.all([
      sortedSwimmers.map((n, i) => axios.put(`${CONFIG.API_URL}/swimmers?access_token=${auth.getToken()}`, sortedSwimmers[i]))
    ])
      .then(() => this.setState({ raceSwimmers: sortedSwimmers }))
      .catch((err) => { console.error(err); this.props.history.push('/logout'); });
  }
  _handleSwimmerChosen(val) {
    let raceSwimmers = this._getRaceSwimmers(this.state.competitionSwimmers, this.state.raceId, this.props.currentCompetitionId);
    let competitionTimes = val.value.times.filter(
      (n) => n.competitionId === this.props.currentCompetitionId
    );
    if (raceSwimmers.filter((n) => n == val.value).length > 0) {
      alert('Zawodnik został już dodany');
      return false;
    } else if (_uniqBy(competitionTimes, 'raceId').length >= 2) {
      alert('Zawodnik bierze udział w dwóch wyścigach');
      return false;
    } else {
      let swimmerToSave = val.value;
      swimmerToSave.raceIds.push(this.state.raceId);
      axios.put(`${CONFIG.API_URL}/swimmers/${swimmerToSave.id}?access_token=${auth.getToken()}`, swimmerToSave)
        .then(() => {
          raceSwimmers.push(swimmerToSave);
          this.setState({ raceSwimmers: raceSwimmers });
        })
        .catch((err) => { console.error(err); this.props.history.push('/logout'); });
    }
  }
  _deleteSwimmer(id) {
    let raceSwimmers = this.state.raceSwimmers;
    for (let swimmer of raceSwimmers) {
      if (swimmer.id == id) {
        _remove(swimmer.raceIds, (n) => n === this.state.raceId);
        _remove(swimmer.times, (n) => n.raceId == this.state.raceId && n.competitionId == this.props.currentCompetitionId);
        console.log(localStorage.currentCompetitionId)
        axios.put(`${CONFIG.API_URL}/competitions/${this.props.currentCompetitionId}/swimmers/${id}?access_token=${auth.getToken()}`, swimmer)
          .then(() => {
            let newRaceSwimmers = raceSwimmers.filter((n) => n.id !== id);
            this.setState({ raceSwimmers: newRaceSwimmers});
          })
          .catch((err) => { console.error(err); this.props.history.push('/logout'); });
      }
    }
  }
  _saveTime(time, swimmerId) {
    const alreadyHasRaceTime = (swimmer, nb) => swimmer.times.filter((n) => {
      return (n.raceId == this.state.raceId && n.competitionId == this.props.currentCompetitionId);
    }).length > nb;
    let raceSwimmers = this.state.raceSwimmers.slice();
    let swimmerToSave = raceSwimmers.filter((n) => n.id == swimmerId)[0];
    if (alreadyHasRaceTime(swimmerToSave, 0)) {
      let timeIndex;
      let timeToSave = swimmerToSave.times.filter((n, i) => {
        if (n.raceId == this.state.raceId && n.competitionId == this.props.currentCompetitionId) {
          timeIndex = i;
        }
        return n.raceId == this.state.raceId && n.competitionId == this.props.currentCompetitionId;
      })[0];
      timeToSave.time = Number(time);
      swimmerToSave.times[timeIndex] = timeToSave;
      axios.put(`${CONFIG.API_URL}/swimmers/${swimmerToSave.id}?access_token=${auth.getToken()}`, swimmerToSave)
        .then(() => this.setState({ raceSwimmers: raceSwimmers }))
        .catch((err) => { console.error(err); this.props.history.push('/logout'); });
    } else {
      let objToSave = {
        raceId: this.state.raceId,
        competitionId: this.props.currentCompetitionId,
        time: Number(time)
      };
      swimmerToSave.times.push(objToSave);
      axios.put(`${CONFIG.API_URL}/swimmers/${swimmerToSave.id}?access_token=${auth.getToken()}`, swimmerToSave)
        .then(() => {
          this.setState({ raceSwimmers: raceSwimmers });
        })
        .catch((err) => { console.error(err); this.props.history.push('/logout'); });
    }
    this._saveSwimmersPoints(this.state.raceId);
  }
  componentDidMount() {
    let competitionId = localStorage.getItem('currentCompetitionId');
    axios.all([
      axios.get(`${CONFIG.API_URL}/competitions/${competitionId}/swimmers`),
      axios.get(`${CONFIG.API_URL}/schools`),
      axios.get(`${CONFIG.API_URL}/competitions`)
    ])
      .then(axios.spread((swimmersRes, schoolsRes, competitionsRes) => {
        let raceSwimmers = this._getRaceSwimmers(swimmersRes.data, this.state.raceId, localStorage.currentCompetitionId)
        this.setState({
          competitionSwimmers: swimmersRes.data,
          raceSwimmers: raceSwimmers,
          competitionSchools: schoolsRes.data,
          competitions: competitionsRes.data
        });
      }))
      .catch((error) => console.error(error));
  }
  render() {
    let competitionId = localStorage.getItem('currentCompetitionId');
    let swimmerChoices = this.state.competitionSwimmers.map((n) => {
      return {
        value: n,
        label: `${n.name} ${n.surname}`
      };
    });
    let sortedSwimmers = this.state.raceSwimmers.sort((a, b) =>
      getRaceTimeInCompetition(a, this.state.raceId, competitionId) -
      getRaceTimeInCompetition(b, this.state.raceId, competitionId)
    );
    return (
      <div>
        <h3 className='uk-text-center uk-margin-top uk-margin-bottom'>Wyniki</h3>
        <ChooseRace getCategory={this._getCategory}/>
        <Select
          name='swimmer'
          options={swimmerChoices}
          onChange={this._handleSwimmerChosen}
          className='uk-width-2-10 uk-align-center uk-margin-large-top'
        />
        <RaceSwimmersList swimmers={sortedSwimmers}
                          schools={this.state.competitionSchools}
                          deleteSwimmer={this._deleteSwimmer}
                          raceId={this.state.raceId}
                          saveTime={this._saveTime}/>
      </div>
    );
  }
}

export default Times;
