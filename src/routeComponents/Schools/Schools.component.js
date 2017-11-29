import React, {Component} from 'react';
import SchoolForm from '../../components/SchoolForm/SchoolForm.component';
import SchoolsList from '../../components/SchoolsList/SchoolsList.component';
import SchoolEditForm from '../../components/SchoolEditForm/SchoolEditForm.component';
import axios from 'axios';
import CONFIG from '../../config';
import _remove from 'lodash/remove';
import _findIndex from 'lodash/findIndex';
import auth from '../../auth';

class Schools extends Component {
  constructor() {
    super();
    this._addSchool = this._addSchool.bind(this);
    this._deleteSchool = this._deleteSchool.bind(this);
    this._saveSchool = this._saveSchool.bind(this);
    this._displayEditForm = this._displayEditForm.bind(this);
    this.state = {
      schools: [],
      editFormVisible: false,
      clickedSchoolId: 0
    };
  }
  _addSchool(name, isRanked) {
    let schoolToAdd = {
      name: name,
      isRanked: isRanked
    };
    axios.post(`${CONFIG.API_URL}/schools?access_token=${auth.getToken()}`, schoolToAdd)
      .then((response) => {
        let currentSchools = this.state.schools;
        currentSchools.push(response.data);
        this.setState({ schools: currentSchools });
      })
      .catch((error) => { console.error(error); this.props.history.push('/logout'); });
  }
  _deleteSchool(id) {
    let toDelete = confirm('Czy chcesz skasować szkołę?');
    if (toDelete) {
      axios.delete(`${CONFIG.API_URL}/schools/${id}?access_token=${auth.getToken()}`)
        .then((response) => {
          if (response.status === 200) {
            let currentSchools = this.state.schools;
            _remove(currentSchools, (n) => n.id == id);
            this.setState({ schools: currentSchools });
          }
        })
        .catch((error) => { console.error(error); this.props.history.push('/logout'); });
    }
  }
  _saveSchool(name, isRanked) {
    let schoolToSave = {
      name: name,
      isRanked: isRanked
    };
    axios.put(`${CONFIG.API_URL}/schools/${this.state.clickedSchoolId}?access_token=${auth.getToken()}`, schoolToSave)
      .then((response) => {
        let currentSchools = this.state.schools;
        let schoolIndex = _findIndex(currentSchools, (n) => n.id == this.state.clickedSchoolId);
        currentSchools[schoolIndex] = response.data;
        this.setState({ schools: currentSchools });
      })
      .catch((error) => { console.error(error); this.props.history.push('/logout'); });
  }
  _displayEditForm(id) {
    this.setState({
      editFormVisible: true,
      clickedSchoolId: id
    });
  }
  componentDidMount() {
    axios.get(`${CONFIG.API_URL}/schools`)
      .then((response) => this.setState({ schools: response.data }))
      .catch((error) => console.error(error));
  }
  render() {
    let clickedSchool = this.state.schools.filter((n) => n.id == this.state.clickedSchoolId)[0];
    return (
      <div>
        <SchoolForm addSchool={this._addSchool} />
        <SchoolsList schools={this.state.schools}
                     deleteSchool={this._deleteSchool}
                     displayEditForm={this._displayEditForm} />
        <SchoolEditForm  editFormVisible={this.state.editFormVisible}
                         clickedSchool={clickedSchool}
                         saveSchool={this._saveSchool} />
      </div>
    );
  }
}

export default Schools;
