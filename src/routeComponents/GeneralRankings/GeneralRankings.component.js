import React, {Component} from 'react';
import ChooseRace from '../../components/ChooseRace/ChooseRace.component';
import ClassificationSwimmersList from '../../components/ClassificationSwimmersList/ClassificationSwimmersList.component';
import GeneralRankingByRace from '../../components/GeneralRankingByRace/GeneralRankingByRace.component';
import ClassificationSchoolsList from '../../components/ClassificationSchoolsList/ClassificationSchoolsList.component';
import axios from 'axios';
import CONFIG from '../../config';
import getRaceIdByCategory from '../../helpers/getRaceIdByCategory';
import isSwimmerRanked from '../../helpers/isSwimmerRanked';

class GeneralRankings extends Component {
  constructor() {
    super();
    this._getCategory = this._getCategory.bind(this);
    this._updateRaceId = this._updateRaceId.bind(this);
    this._getRaceTime = this._getRaceTime.bind(this);
    this.state = {
      raceId: '',
      raceSwimmers: [],
      allSwimmers: [],
      schools: []
    };
  }
  _getRaceTime(swimmer, raceId) {
    let timeObj = swimmer.times.filter(
      (n) => n.raceId === raceId
    );
    if (timeObj.length > 0) {
      return Number(timeObj[0].time);
    }
    return 0;
  }
  _updateRaceId(raceId) {
    let raceSwimmers = this.state.allSwimmers.filter((n) => n.raceIds.includes(raceId));
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
    axios.all([
      axios.get(`${CONFIG.API_URL}/swimmers`),
      axios.get(`${CONFIG.API_URL}/schools`),
      axios.get(`${CONFIG.API_URL}/competitions`)
    ])
      .then(axios.spread((swimmersRes, schoolsRes) => {
        let raceSwimmers = swimmersRes.data.filter((n) => n.raceIds.includes(this.state.raceId));
        let sortedSwimmers = raceSwimmers.sort((a, b) =>
          this._getRaceTime(a, this.state.raceId) - this._getRaceTime(b, this.state.raceId)
        );
        this.setState({
          allSwimmers: swimmersRes.data,
          raceSwimmers: sortedSwimmers,
          schools: schoolsRes.data
        });
      }))
      .catch((error) => console.error(error));
  }
  render() {
    let raceSwimmers = this.state.raceSwimmers.filter((swimmer) => isSwimmerRanked(swimmer, this.state.schools));
    let allSwimmers = this.state.allSwimmers.filter(
      (swimmer) => isSwimmerRanked(swimmer, this.state.schools)
    );
    let rankedSchools = this.state.schools.filter((n) => n.isRanked);
    return (
      <div>
        <h3 className='uk-text-center uk-margin-top'>Klasyfikacja wg kategorii</h3>
        <ChooseRace getCategory={this._getCategory}/>
        <GeneralRankingByRace swimmers={raceSwimmers}
                              raceId={this.state.raceId}
                              schools={this.state.schools} />
        <h3 className='uk-text-center uk-margin-large-top'>Klasyfikacja ogólna zawodników</h3>
        <ClassificationSwimmersList schools={this.state.schools}
                                    swimmers={allSwimmers}
                                    isGeneral={true} />
        <h3 className='uk-text-center uk-margin-large-top'>Klasyfikacja ogólna szkół</h3>
        <ClassificationSchoolsList schools={rankedSchools}
                                   swimmers={allSwimmers}
                                   isGeneral={true} />
      </div>
    );
  }
}

export default GeneralRankings;
