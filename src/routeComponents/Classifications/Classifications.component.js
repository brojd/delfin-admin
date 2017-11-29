import React, {Component} from 'react';
import ChooseRace from '../../components/ChooseRace/ChooseRace.component';
import ClassificationSwimmersListByRace from '../../components/ClassificationSwimmersListByRace/ClassificationSwimmersListByRace.component';
import ClassificationSchoolsList from '../../components/ClassificationSchoolsList/ClassificationSchoolsList.component';
import ClassificationSwimmersList from '../../components/ClassificationSwimmersList/ClassificationSwimmersList.component';
import getRaceIdByCategory from '../../helpers/getRaceIdByCategory';
import isSwimmerRanked from '../../helpers/isSwimmerRanked';
import axios from 'axios';
import CONFIG from '../../config';

class Classifications extends Component {
  constructor() {
    super();
    this._getCategory = this._getCategory.bind(this);
    this._updateRaceId = this._updateRaceId.bind(this);
    this._getRaceTime = this._getRaceTime.bind(this);
    this.state = {
      raceId: '',
      raceSwimmers: [],
      competitionSwimmers: [],
      schools: []
    };
  }
  _getRaceTime(swimmer, raceId) {
    let timeObj = swimmer.times.filter(
      (n) => n.raceId === raceId && n.competitionId == localStorage.getItem('currentCompetitionId')
    );
    if (timeObj.length > 0) {
      return Number(timeObj[0].time);
    }
    return 0;
  }
  _updateRaceId(raceId) {
    let raceSwimmers = this.state.competitionSwimmers.filter((n) => n.raceIds.includes(raceId));
    let sortedSwimmers = raceSwimmers.sort((a, b) =>
      this._getRaceTime(a, raceId) - this._getRaceTime(b, raceId)
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
  componentDidMount() {
    let currentCompetitionId = localStorage.getItem('currentCompetitionId');
    this.setState({ currentCompetitionId: currentCompetitionId });
    axios.all([
      axios.get(`${CONFIG.API_URL}/competitions/${currentCompetitionId}/swimmers`),
      axios.get(`${CONFIG.API_URL}/schools`),
      axios.get(`${CONFIG.API_URL}/competitions`)
    ])
      .then(axios.spread((swimmersRes, schoolsRes, competitionsRes) => {
        let raceSwimmers = swimmersRes.data.filter((n) => n.raceIds.includes(this.state.raceId));
        let sortedSwimmers = raceSwimmers.sort((a, b) =>
          this._getRaceTime(a, this.state.raceId) - this._getRaceTime(b, this.state.raceId)
        );
        this.setState({
          competitionSwimmers: swimmersRes.data,
          raceSwimmers: sortedSwimmers,
          schools: schoolsRes.data,
          competitions: competitionsRes.data
        });
      }))
      .catch((error) => console.error(error));
  }
  render() {
    let competitionId = localStorage.getItem('currentCompetitionId');
    let raceSwimmers = this.state.raceSwimmers.filter((swimmer) => isSwimmerRanked(swimmer, this.state.schools));
    let competitionSwimmers = this.state.competitionSwimmers.filter(
      (swimmer) => isSwimmerRanked(swimmer, this.state.schools)
    );
    let rankedSchools = this.state.schools.filter((n) => n.isRanked);
    return (
      <div>
        <h3 className='uk-text-center uk-margin-top'>Ranking zawodników wg kategorii</h3>
        <ChooseRace getCategory={this._getCategory}/>
        <ClassificationSwimmersListByRace swimmers={raceSwimmers}
                                          raceId={this.state.raceId}
                                          schools={this.state.schools}
                                          competitionId={competitionId}
                                          className='uk-margin-large-top'/>
        <h3 className='uk-text-center uk-margin-large-top'>Ranking ogólny zawodów</h3>
        <ClassificationSwimmersList schools={this.state.schools}
                                    swimmers={competitionSwimmers}
                                    isGeneral={false} />
        <h3 className='uk-text-center uk-margin-large-top'>Ranking szkół</h3>
        <ClassificationSchoolsList schools={rankedSchools}
                                   swimmers={competitionSwimmers}
                                   isGeneral={false} />
      </div>
    );
  }
}

export default Classifications;
