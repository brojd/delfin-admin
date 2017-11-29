import React, {Component} from 'react';
import ChooseRace from '../../components/ChooseRace/ChooseRace.component';
import getRaceIdByCategory from '../../helpers/getRaceIdByCategory';
import getSchoolNameById from '../../helpers/getSchoolNameById';
import axios from 'axios';
import CONFIG from '../../config';
import styles from './Records.stylesheet.css';

class Records extends Component {
  constructor() {
    super();
    this._getCategory = this._getCategory.bind(this);
    this._updateRaceId = this._updateRaceId.bind(this);
    this._getRecordInCategory = this._getRecordInCategory.bind(this);
    this.state = {
      raceId: 1,
      raceSwimmers: [],
      swimmers: []
    };
  }
  _updateRaceId(raceId) {
    let raceSwimmers = this.state.swimmers.filter((n) => n.raceIds.includes(raceId));
    this.setState({
      raceId: raceId,
      raceSwimmers: raceSwimmers
    });
  }
  _getCategory(sex, style, age) {
    let currentId = getRaceIdByCategory(sex, style, age);
    this._updateRaceId(currentId);
  }
  _getRecordInCategory(swimmers, raceId) {
    let sortedSwimmers = swimmers.sort((a, b) => {
      let bestTimeA = a.times.filter((n) => n.raceId === raceId).sort((c, d) => c.time - d.time)[0].time;
      let bestTimeB = b.times.filter((n) => n.raceId === raceId).sort((c, d) => c.time - d.time)[0].time;
      return bestTimeA - bestTimeB;
    });
    let recordTime = sortedSwimmers[0].times.filter((n) => n.raceId === raceId).sort((c, d) => c.time - d.time)[0].time;
    let time = sortedSwimmers ? recordTime : '';
    let result = {
      swimmer: sortedSwimmers[0],
      time: time
    };
    return result;
  }
  componentDidMount() {
    axios.all([
      axios.get(`${CONFIG.API_URL}/swimmers`),
      axios.get(`${CONFIG.API_URL}/schools`)
    ])
      .then(axios.spread((swimmersRes, schoolsRes) => {
        let raceSwimmers = swimmersRes.data.filter((n) => n.raceIds.includes(this.state.raceId));
        this.setState({
          swimmers: swimmersRes.data,
          raceSwimmers: raceSwimmers,
          schools: schoolsRes.data
        });
      }))
      .catch((error) => console.error(error));
  }

  render() {
    let record = '';
    if (this.state.raceSwimmers.length > 0) {
      let resultObj = this._getRecordInCategory(this.state.raceSwimmers, this.state.raceId);
      record = <div className={styles.record}>{resultObj.swimmer.name} {resultObj.swimmer.surname}
       ({getSchoolNameById(this.state.schools, resultObj.swimmer.schoolId)}) {resultObj.time} sek</div>;
    }
    return (
      <div>
        <h3 className='uk-text-center uk-margin-top uk-align-center'>Rekordy wg kategorii</h3>
        <ChooseRace getCategory={this._getCategory}/>
        {record}
      </div>
    );
  }
}

export default Records;
