import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import styles from './Main.stylesheet.css';

class Main extends Component {
  constructor() {
    super();
    this._competitionChanged = this._competitionChanged.bind(this);
    this.state = {};
  }
  _competitionChanged(e, id) {
    this.setState({ currentCompetitionId: id });
    this.props.passCompetitionId(id);
  }
  render() {
    return (
      <main className={classNames('uk-float-right uk-width-5-6', styles.Main)}>
        {this.props.children && React.cloneElement(this.props.children, {
          competitionChanged: this._competitionChanged,
          competitions: this.props.competitions,
          currentCompetitionId: this.props.currentCompetitionId
        })}
      </main>
    );
  }
}

Main.propTypes = {
  competitionChanged: PropTypes.func,
  competitions: PropTypes.array,
  currentCompetitionId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
};

export default Main;
