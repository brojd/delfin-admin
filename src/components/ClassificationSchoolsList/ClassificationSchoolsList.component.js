import React, {Component} from 'react';
import styles from './ClassificationSchoolsList.stylesheet.css';
import classNames from 'classnames';

class ClassificationSchoolsList extends Component {
  constructor() {
    super();
    this._getSchoolPoints = this._getSchoolPoints.bind(this);
    this._getPlace = this._getPlace.bind(this);
    this.state = {};
  }
  _getSchoolPoints(schoolId) {
    let result = 0;
    let schoolSwimmers = this.props.swimmers.filter((n) => n.schoolId === schoolId);
    schoolSwimmers.forEach((swimmer) => {
      swimmer.times.forEach((timeObj) => {
        if (!this.props.isGeneral) {
          if (timeObj.competitionId === localStorage.getItem('currentCompetitionId')) {
            result += timeObj.points;
          }
        } else {
          result += timeObj.points;
        }
      });
    });
    return result;
  }
  _getPlace(sortedSchools, index) {
    let school = sortedSchools[index];
    let upperSchool = sortedSchools[index-1];
    if (index === 0) {
      return 1;
    } else if (index > 0 && this._getSchoolPoints(school.id) === this._getSchoolPoints(upperSchool.id)) {
      school.place = upperSchool.place;
    } else if (index > 0 && this._getSchoolPoints(school.id) !== this._getSchoolPoints(upperSchool.id)) {
      school.place = index + 1;
    }
    return school.place;
  }
  render() {
    let sortedSchools = this.props.schools.slice().sort(
      (a, b) => this._getSchoolPoints(b.id) - this._getSchoolPoints(a.id)
    );
    return (
      <div className={classNames(styles.ClassificationSchoolsListWrapper, 'uk-width-6-10 uk-align-center')}>
        <table className={classNames(styles.ClassificationSchoolsList, 'uk-table')}>
          <caption>Szkoły</caption>
          <tbody>
            {sortedSchools.map((school, i) =>
              <tr className={styles.ClassificationSchoolsList_tr} key={i}>
                <td className={classNames(styles.ClassificationSchoolsList_td, 'uk-width-2-10')}>
                  {this._getPlace(sortedSchools, i)}
                </td>
                <td className={classNames(styles.ClassificationSchoolsList_td, 'uk-width-6-10')}>
                  {school.name}
                </td>
                <td className={classNames(styles.ClassificationSchoolsList_td, 'uk-width-2-10')}>
                  {this._getSchoolPoints(school.id)} pkt
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    );
  }
}

ClassificationSchoolsList.defaultProps = {
  schools: [],
  swimmers: []
};

export default ClassificationSchoolsList;
