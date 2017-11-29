import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import styles from'./SchoolEditForm.stylesheet.css';

class SchoolEditForm extends Component {
  constructor() {
    super();
    this._handleNameChange = this._handleNameChange.bind(this);
    this._handleIsRankedChange = this._handleIsRankedChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this.state = {
      name: ''
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
    this.props.saveSchool(this.state.name, this.state.isRanked);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      name: nextProps.clickedSchool.name,
      isRanked: nextProps.clickedSchool.isRanked
    });
  }
  render() {
    return (
      <form className={classNames(styles.EditForm, 'uk-width-4-10 uk-form uk-align-center uk-form-stacked',
                      {[styles.visible]: this.props.editFormVisible}, {[styles.hidden]: !this.props.editFormVisible})}>
        <legend>Edytuj szkołę</legend>
        <div className='uk-form-row'>
          <label className='uk-form-label'>Nazwa szkoły:</label>
          <input type='text'
                 name='name'
                 value={this.state.name}
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
          <button className={classNames(styles.EditForm_saveButton, 'uk-button uk-align-center')}
                  type='submit'
                  onClick={this._handleSubmit}>
            Zapisz
          </button>
        </div>
      </form>
    );
  }
}

SchoolEditForm.propTypes = {
  saveSchool: PropTypes.func,
  editFormVisible: PropTypes.bool,
  clickedSchool: PropTypes.object
};

SchoolEditForm.defaultProps = {
  clickedSchool: {
    name: ''
  }
};

export default SchoolEditForm;
