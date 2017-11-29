import React, { PropTypes } from 'react';
import styles from './SwimmersList.stylesheet.css';
import classNames from 'classnames';

const SwimmerList = ({ swimmers, deleteSwimmer, displayEditForm, schools, editable }) => {

  let getCurrentSchoolName = (swimmerId) => {
    if (schools.length > 0) {
      let currentSwimmer = swimmers.filter((n) => n.id === swimmerId)[0];
      let currentSchool = schools.filter((n) => n.id === currentSwimmer.schoolId)[0];
      return currentSchool.name;
    }
    return null;
  };
  return (
    <div className={classNames(styles.SwimmersListWrapper, 'uk-width-6-10 uk-align-center')}>
      <table className={classNames(styles.SwimmersList, 'uk-table')}>
        <caption>Zawodnicy</caption>
        <tbody>
          {swimmers.map((n, i) =>
          <tr className={styles.SwimmersList_tr} key={i}>
            <td className={classNames(styles.SwimmersList_td, 'uk-width-1-10')}>{i+1}.</td>
            <td className={classNames(styles.SwimmersList_td, 'uk-width-4-10')}>{n.name} {n.surname}</td>
            <td className={classNames(styles.SwimmersList_td, 'uk-width-3-10')}>({getCurrentSchoolName(n.id)})</td>
            <td className={classNames(styles.SwimmersList_td, 'uk-width-2-10 uk-text-right')}>
              {editable ?
                <i onClick={() => displayEditForm(n.id)}
                   className={classNames(styles.SwimmersList_icon, 'uk-icon-pencil uk-margin-left')}></i> :
                null}
              <i onClick={() => deleteSwimmer(n.id)}
                 className={classNames(styles.SwimmersList_icon, 'uk-icon-trash uk-margin-small-left')}></i>
            </td>
          </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

SwimmerList.propTypes = {
  deleteSwimmer: PropTypes.func,
  displayEditForm: PropTypes.func,
  swimmers: PropTypes.array,
  schools: PropTypes.array,
  editable: PropTypes.bool
};

export default SwimmerList;
