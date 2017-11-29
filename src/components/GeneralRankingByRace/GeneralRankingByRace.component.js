import React, {Component, PropTypes} from 'react';
import getSchoolNameById from '../../helpers/getSchoolNameById';
import styles from './GeneralRankingByRace.stylesheet.css';
import classNames from 'classnames';

class GeneralRankingByRace extends Component {
  constructor() {
    super();
    this.state = {
      swimmers: []
    };
    this._getRacePoints = this._getRacePoints.bind(this);
    this._getPlace = this._getPlace.bind(this);
  }
  _getRacePoints(swimmer, raceId) {
    let points = 0;
    let timeObjects = swimmer.times.filter(
      (n) => n.raceId === raceId
    );
    timeObjects.forEach((n) => {
      points += n.points;
    });
    return points;
  }
  _getPlace(sortedSwimmers, index) {
    let swimmer = sortedSwimmers[index];
    let upperSwimmer = sortedSwimmers[index-1];
    if (index === 0) {
      return 1;
    } else if (this._getRacePoints(swimmer, this.props.raceId) === this._getRacePoints(upperSwimmer, this.props.raceId)) {
      swimmer.place = upperSwimmer.place;
    } else if (this._getRacePoints(swimmer, this.props.raceId) !== this._getRacePoints(upperSwimmer, this.props.raceId)) {
      swimmer.place = index + 1;
    }
    return swimmer.place;
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      swimmers: nextProps.swimmers,
      schools: nextProps.schools
    });
  }
  render() {
    let sortedSwimmers = this.state.swimmers.slice().sort(
      (a, b) => this._getRacePoints(b, this.props.raceId) - this._getRacePoints(a, this.props.raceId)
    );
    return (
      <div className={classNames(styles.GeneralRankingByRaceWrapper, 'uk-width-8-10 uk-align-center')}>
        <table className={classNames(styles.GeneralRankingByRace, 'uk-table')}>
          <caption>Zawodnicy</caption>
          <tbody>
            {sortedSwimmers.map((n, i) => (
              <tr className={styles.GeneralRankingByRace_tr} key={i}>
                <td className={classNames(styles.GeneralRankingByRace_td, 'uk-width-1-10')}>
                  {this._getPlace(sortedSwimmers, i)}
                </td>
                <td className={classNames(styles.GeneralRankingByRace_td, 'uk-width-4-10')}>
                  {n.name} {n.surname}
                </td>
                <td className={classNames(styles.GeneralRankingByRace_td, 'uk-width-4-10')}>
                  ({getSchoolNameById(this.state.schools, n.schoolId)})
                </td>
                <td className={classNames(styles.GeneralRankingByRace_td, 'uk-width-1-10')}>
                  {this._getRacePoints(n, this.props.raceId)} pkt
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

GeneralRankingByRace.propTypes = {
  swimmers: PropTypes.array,
  schools: PropTypes.array,
  raceId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
};

export default GeneralRankingByRace;
