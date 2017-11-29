import React, {Component, PropTypes} from 'react';
import getRaceTimeInCompetition from '../../helpers/getRaceTimeInCompetition';
import getRacePlaceInCompetition from '../../helpers/getRacePlaceInCompetition';
import isSwimmerRanked from '../../helpers/isSwimmerRanked';
import styles from './RaceSwimmersList.stylesheet.css';
import classNames from 'classnames';

class RaceSwimmersList extends Component {
  constructor() {
    super();
    this._handleSaveTime = this._handleSaveTime.bind(this);
    this._handleTimeChange = this._handleTimeChange.bind(this);
    this._getCurrentSchoolName = this._getCurrentSchoolName.bind(this);
    this.state = {
      swimmers: [],
      schools: []
    };
  }
  _handleSaveTime(e, swimmerId) {
    if (e.target.value < 1) {
      alert('Czas musi wynosić minimum 1 sek');
      e.target.value = 1;
    }
    this.props.saveTime(e.target.value, swimmerId);
  }
  _handleTimeChange(e, swimmerId) {
    let swimmers = this.state.swimmers;
    let swimmerIndex;
    let swimmerToChange = swimmers.filter((n, i) => {
      if (n.id == swimmerId) {
        swimmerIndex = i;
      }
      return n.id == swimmerId;
    })[0];
    swimmerToChange['time'] = e.target.value;
    swimmers[swimmerIndex] = swimmerToChange;
    this.setState({ swimmers: swimmers });
    return e.target.value;
  }
  _getCurrentSchoolName(swimmerId) {
    if (this.props.schools.length > 0) {
      let currentSwimmer = this.props.swimmers.filter((n) => n.id === swimmerId)[0];
      let currentSchool = this.props.schools.filter((n) => n.id === currentSwimmer.schoolId)[0];
      return currentSchool.name;
    }
    return null;
  }
  componentDidMount() {
    let competitionId = localStorage.getItem('currentCompetitionId');
    let swimmers = this.props.swimmers;
    if (swimmers.length > 0) {
      swimmers.forEach((n) => {
        n.time = getRaceTimeInCompetition(n, this.props.raceId, competitionId);
      });
    }
    this.setState({ swimmers: swimmers });
  }
  componentWillReceiveProps(nextProps) {
    let competitionId = localStorage.getItem('currentCompetitionId');
    let swimmers = nextProps.swimmers;
    if (swimmers.length > 0) {
      swimmers.forEach((n) => {
        n.time = getRaceTimeInCompetition(n, nextProps.raceId, competitionId);
      });
    }
    this.setState({ swimmers: swimmers });
  }
  render() {
    let competitionId = localStorage.getItem('currentCompetitionId');
    return (
      <div className={classNames(styles.RaceSwimmersListWrapper, 'uk-width-8-10 uk-align-center')}>
        <table className={classNames(styles.RaceSwimmersList, 'uk-table')}>
          <caption>Wyniki</caption>
          <tbody>
            {this.state.swimmers.map((swimmer, i) => (
              <tr className={styles.RaceSwimmersList_tr} key={i}>
                <td className={classNames(styles.RaceSwimmersList_td, 'uk-width-1-10')}>
                  {isSwimmerRanked(swimmer, this.props.schools) ?
                    getRacePlaceInCompetition(swimmer, this.props.raceId, competitionId) : 'NOT RANKED '}
                </td>
                <td className={classNames(styles.RaceSwimmersList_td, 'uk-width-3-10')}>
                  {swimmer.name} {swimmer.surname}
                </td>
                <td className={classNames(styles.RaceSwimmersList_td, 'uk-width-3-10')}>
                  {this._getCurrentSchoolName(swimmer.id)}
                </td>
                <td className={classNames(styles.RaceSwimmersList_td, 'uk-width-2-10')}>
                  <input type='number'
                         step='any'
                         onBlur={(e) => this._handleSaveTime(e, swimmer.id)}
                         onChange={(e) => this._handleTimeChange(e, swimmer.id)}
                         value={swimmer.time}
                         min={1}
                         required
                         className='uk-width-7-10'/>
                  <span className='uk-3-10'>sek</span>
                </td>
                <td className={classNames(styles.RaceSwimmersList_td, 'uk-width-1-10')}>
                  <i onClick={() => this.props.deleteSwimmer(swimmer.id)}
                     className={classNames(styles.RaceSwimmersList_icon, 'uk-icon-trash uk-margin-small-left')}>
                  </i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

RaceSwimmersList.propTypes = {
  swimmers: PropTypes.array,
  schools: PropTypes.array,
  deleteSwimmer: PropTypes.func,
  raceId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  saveTime: PropTypes.func,
};

export default RaceSwimmersList;
