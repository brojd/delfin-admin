import React, {Component, PropTypes} from 'react';
import axios from 'axios';
import CONFIG from '../../config';
import auth from '../../auth';
import styles from './CompetitionSettings.stylesheet.css';
import classNames from 'classnames';

class CompetitionSettings extends Component {
  constructor() {
    super();
    this._handleSave = this._handleSave.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._getPoints = this._getPoints.bind(this);
    this.state = {};
  }
  _handleSave() {
    let competitionToSave = this.props.currentCompetition;
    competitionToSave.ranks = this.state.ranks;
    axios.put(`${CONFIG.API_URL}/competitions/${competitionToSave.id}?access_token=${auth.getToken()}`, competitionToSave)
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }
  _handleChange(e, n) {
    let objToSave = {};
    let ranks = this.state.ranks;
    objToSave['points'] = e.target.value;
    ranks[n] = objToSave;
    this.setState({ ranks: ranks });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentCompetition) {
      this.setState({ ranks: nextProps.currentCompetition.ranks });
    }
  }
  _getPoints(place) {
    if (this.state.ranks) {
      return this.state.ranks[place].points;
    } else {
      return '';
    }
  }
  render() {
    let nbOfDifferentRanks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    return (
      <div className={classNames(styles.CompetitionSettingsWrapper, 'uk-width-4-10 uk-align-center')}>
        <table className={classNames(styles.CompetitionSettings, 'uk-table')}>
          <caption>Punktacja</caption>
          <tbody>
            {nbOfDifferentRanks.map((n, i) => (
              <tr className={styles.CompetitionSettings_tr} key={i}>
                <td className={classNames(styles.CompetitionSettings_td, 'uk-width-3-10')}>Miejsce {n}</td>
                <td className={classNames(styles.CompetitionSettings_td, 'uk-width-7-10')}>
                  Punkty: <input type='number'
                                onChange={(e) => this._handleChange(e, n)}
                                value={this._getPoints(n)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className={classNames(styles.saveButton, 'uk-button uk-align-center')}
                type='click'
                onClick={this._handleSave}>
          Zapisz
        </button>
      </div>
    );
  }
}

CompetitionSettings.propTypes = {
  currentCompetition: PropTypes.object
};

export default CompetitionSettings;
