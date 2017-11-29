import React, {Component, PropTypes} from 'react';
import styles from './SwimmerForm.stylesheet.css';
import classNames from 'classnames';

class SwimmerForm extends Component {
  constructor() {
    super();
    this._handleNameChange = this._handleNameChange.bind(this);
    this._handleSurnameChange = this._handleSurnameChange.bind(this);
    this._handleSelectChange = this._handleSelectChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this.state = {
      name: '',
      surname: '',
      schoolId: ''
    };
  }
  _handleNameChange(e) {
    this.setState({ name: e.target.value });
  }
  _handleSurnameChange(e) {
    this.setState({ surname: e.target.value });
  }
  _handleSelectChange(e) {
    this.setState({ schoolId: e.target.value });
  }
  _handleSubmit(e) {
    e.preventDefault();
    this.setState({ name: '', surname: '' });
    this.props.addSwimmer(this.state.name, this.state.surname, this.state.schoolId);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.schools.length > 0) {
      this.setState({ schoolId: nextProps.schools[0].id });
    }
  }
  render() {
    return (
      <form className={classNames(styles.SwimmerForm, 'uk-width-4-10 uk-form uk-align-center uk-form-stacked')}>
        <legend>Dodaj zawodnika</legend>
        <div className='uk-form-row'>
          <label className='uk-form-label'>Imię:</label>
          <input type='text'
                 name='name'
                 value={this.state.name}
                 onChange={this._handleNameChange} />
        </div>
        <div className='uk-form-row'>
          <label className='uk-form-label'>Nazwisko:</label>
          <input type='text'
                 name='surname'
                 value={this.state.surname}
                 onChange={this._handleSurnameChange} />
        </div>
        <div className='uk-form-row'>
          <label className='uk-form-label'>Szkoła:</label>
          <select value={this.state.schoolId}
                  onChange={this._handleSelectChange}>
            {this.props.schools.map((n, i) => {
              return (
                <option key={i} value={n.id}>{n.name}</option>
              );
            })}
          </select>
        </div>
        <div className='uk-form-row'>
          {this.state.name} {this.state.surname}
        </div>
        <div className='uk-form-row'>
          <button className={classNames(styles.SwimmerForm_addButton, 'uk-button uk-align-center')}
                  type='submit'
                  onClick={this._handleSubmit}>
            Dodaj zawodnika
          </button>
        </div>
      </form>
    );
  }
}

SwimmerForm.propTypes = {
  addSwimmer: PropTypes.func,
  schools: PropTypes.array
};

SwimmerForm.defaultProps = {
  schools: []
};

export default SwimmerForm;
