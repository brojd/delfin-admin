import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import styles from'./SwimmerEditForm.stylesheet.css';

class SwimmerEditForm extends Component {
  constructor() {
    super();
    this._handleNameChange = this._handleNameChange.bind(this);
    this._handleSurnameChange = this._handleSurnameChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleSelectChange = this._handleSelectChange.bind(this);
    this.state = {
      currentSwimmer: {}
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
    this.props.saveSwimmer(this.state.name, this.state.surname, this.state.schoolId);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      currentSwimmer: nextProps.clickedSwimmer,
      name: nextProps.clickedSwimmer.name,
      surname: nextProps.clickedSwimmer.surname,
      schoolId: nextProps.clickedSwimmer.schoolId
    });
  }
  render() {
    return (
      <form className={classNames(styles.EditForm, 'uk-width-4-10 uk-form uk-align-center uk-form-stacked',
                                  {[styles.visible]: this.props.editFormVisible},
                                  {[styles.hidden]: !this.props.editFormVisible})}>
        <legend>Edytuj zawodnika</legend>
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
          {this.state.name} {this.state.surname}
        </div>
        <div className='uk-form-row'>
          Szkoła:
          <select value={this.state.schoolId} onChange={this._handleSelectChange}>
            {this.props.schools.map((n, i) => {
              return (
                <option key={i} value={n.id}>{n.name}</option>
              );
            })}
          </select>
        </div>
        <div className='uk-form-row'>
          <button  className={classNames(styles.EditForm_saveButton, 'uk-button uk-align-center')}
                  type='submit'
                  onClick={this._handleSubmit}>
            Zapisz
          </button>
        </div>
      </form>
    );
  }
}

SwimmerEditForm.propTypes = {
  saveSwimmer: PropTypes.func,
  editFormVisible: PropTypes.bool,
  clickedSwimmer: PropTypes.object,
  schools: PropTypes.array
};

SwimmerEditForm.defaultProps = {
  clickedSwimmer: {
    name: '',
    surname: ''
  }
};

export default SwimmerEditForm;
