import React, {Component, PropTypes} from 'react';
import styles from './SchoolForm.stylesheet.css';
import classNames from 'classnames';

class SchoolForm extends Component {
  constructor() {
    super();
    this._handleNameChange = this._handleNameChange.bind(this);
    this._handleIsRankedChange = this._handleIsRankedChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this.state = {
      name: '',
      isRanked: true
    };
  }
  _handleNameChange(e) {
    this.setState({ name: e.target.value });
  }
  _handleIsRankedChange() {
    this.setState({ isRanked: !this.state.isRanked });
  }
  _handleSubmit(e) {
    e.preventDefault();
    this.props.addSchool(this.state.name, this.state.isRanked);
  }
  render() {
    return (
      <form className={classNames(styles.SchoolForm, 'uk-width-4-10 uk-form uk-align-center uk-form-stacked')}>
        <legend>Dodaj szkołę</legend>
        <div className='uk-form-row'>
          <label className='uk-form-label'>Nazwa szkoły:</label>
          <input type='text'
                 name='name'
                 onChange={this._handleNameChange} />
        </div>
        <div className='uk-form-row'>
          Uwzględnij w klasyfikacji
          <input type='checkbox'
                 name='isRanked'
                 onChange={this._handleIsRankedChange}
                 checked={this.state.isRanked}
                 className='uk-margin-left uk-form-controls' />
        </div>
        <div className='uk-form-row'>
          {this.state.name}
        </div>
        <div className='uk-form-row'>
          <button className={classNames(styles.SchoolForm_addButton, 'uk-button uk-align-center')}
                  type='submit'
                  onClick={this._handleSubmit}>
            Dodaj szkołę
          </button>
        </div>
      </form>
    );
  }
}

SchoolForm.propTypes = {
  addSchool: PropTypes.func
};

export default SchoolForm;
