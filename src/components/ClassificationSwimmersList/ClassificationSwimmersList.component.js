import React, {Component, PropTypes} from 'react';
import getSchoolNameById from '../../helpers/getSchoolNameById';
import styles from './ClassificationSwimmersList.stylesheet.css';
import classNames from 'classnames';

class ClassificationSwimmersList extends Component {
  constructor() {
    super();
    this._getSwimmerPoints = this._getSwimmerPoints.bind(this);
    this._getPlace = this._getPlace.bind(this);
    this.state = {};
  }
  _getPlace(sortedSwimmers, index) {
    let currSwimmer = sortedSwimmers[index];
    let upperSwimmer = sortedSwimmers[index-1];
    if (index === 0) {
      return 1;
    } else if (this._getSwimmerPoints(currSwimmer) === this._getSwimmerPoints(upperSwimmer)) {
      currSwimmer.place = upperSwimmer.place;
    } else if (this._getSwimmerPoints(currSwimmer) !== this._getSwimmerPoints(upperSwimmer)) {
      currSwimmer.place = index + 1;
    }
    return currSwimmer.place;
  }
  _getSwimmerPoints(swimmer) {
    let result = 0;
    swimmer.times.forEach((timeObj) => {
      if (!this.props.isGeneral) {
        if (timeObj.competitionId === localStorage.getItem('currentCompetitionId')) {
          result += timeObj.points;
        }
      } else {
        result += timeObj.points;
      }
    });
    return result;
  }
  render() {
    let sortedSwimmers = this.props.swimmers.slice().sort(
      (a, b) => this._getSwimmerPoints(b) - this._getSwimmerPoints(a)
    );
    return (
      <div className={classNames(styles.ClassificationSwimmersListWrapper, 'uk-width-8-10 uk-align-center')}>
        <table className={classNames(styles.ClassificationSwimmersList, 'uk-table')}>
          <caption>Zawodnicy</caption>
          <tbody>
            {sortedSwimmers.map((n, i) => (
              <tr className={styles.ClassificationSwimmersList_tr} key={i}>
                <td className={classNames(styles.ClassificationSwimmersList_td, 'uk-width-1-10')}>
                  {this._getPlace(sortedSwimmers, i)}
                </td>
                <td className={classNames(styles.ClassificationSwimmersList_td, 'uk-width-4-10')}>
                 {n.name} {n.surname}
                </td>
                <td className={classNames(styles.ClassificationSwimmersList_td, 'uk-width-4-10')}>
                  ({getSchoolNameById(this.props.schools, n.schoolId)})
                </td>
                <td className={classNames(styles.ClassificationSwimmersList_td, 'uk-width-1-10')}>
                  {this._getSwimmerPoints(n)} pkt
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

ClassificationSwimmersList.defaultProps = {
  schools: [],
  swimmers: []
};

ClassificationSwimmersList.propTypes = {
  swimmers: PropTypes.array,
  schools: PropTypes.array,
  isGeneral: PropTypes.bool
};

export default ClassificationSwimmersList;
