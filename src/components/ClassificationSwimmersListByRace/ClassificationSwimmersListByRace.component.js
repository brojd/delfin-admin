import React, {Component, PropTypes} from 'react';
import getRaceTimeInCompetition from '../../helpers/getRaceTimeInCompetition';
import getRacePlaceInCompetition from '../../helpers/getRacePlaceInCompetition';
import getRacePointsInCompetition from '../../helpers/getRacePointsInCompetition';
import getSchoolNameById from '../../helpers/getSchoolNameById';
import styles from './ClassificationSwimmersListByRace.stylesheet.css';
import classNames from 'classnames';

class ClassificationSwimmersListByRace extends Component {
  constructor() {
    super();
    this.state = {
      sortedSwimmers: []
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      sortedSwimmers: nextProps.swimmers,
      schools: nextProps.schools
    });
  }
  render() {
    return (
      <div className={classNames(styles.ClassificationSwimmersListByRaceWrapper, 'uk-width-8-10 uk-align-center')}>
        <table className={classNames(styles.ClassificationSwimmersListByRace, 'uk-table')}>
          <caption>Zawodnicy</caption>
          <tbody>
            {this.state.sortedSwimmers.map((n, i) => (
              <tr className={styles.ClassificationSwimmersListByRace_tr} key={i}>
                <td className={classNames(styles.ClassificationSwimmersListByRace_td, 'uk-width-1-10')}>
                  {getRacePlaceInCompetition(n, this.props.raceId, this.props.competitionId)}
                </td>
                <td className={classNames(styles.ClassificationSwimmersListByRace_td, 'uk-width-3-10')}>
                  {n.name} {n.surname}
                </td>
                <td className={classNames(styles.ClassificationSwimmersListByRace_td, 'uk-width-3-10')}>
                  {getSchoolNameById(this.state.schools, n.schoolId)}
                </td>
                <td className={classNames(styles.ClassificationSwimmersListByRace_td, 'uk-width-2-10')}>
                  {getRaceTimeInCompetition(n, this.props.raceId, this.props.competitionId)} sek
                </td>
                <td className={classNames(styles.ClassificationSwimmersListByRace_td, 'uk-width-1-10')}>
                  {getRacePointsInCompetition(n, this.props.raceId, this.props.competitionId)} pkt
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

ClassificationSwimmersListByRace.propTypes = {
  swimmers: PropTypes.array,
  schools: PropTypes.array,
  raceId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  competitionId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
};

export default ClassificationSwimmersListByRace;
