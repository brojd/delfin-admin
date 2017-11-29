import React, {PropTypes} from 'react';
import styles from './SchoolsList.stylesheet.css';
import classNames from 'classnames';

const SchoolList = ({ schools, deleteSchool, displayEditForm }) => {

  return (
    <div className='uk-width-6-10 uk-align-center'>
      <table className={classNames(styles.SchoolsList, 'uk-table')}>
        <caption>Szkoły</caption>
        <tbody>
          {schools.map((n, i) =>
            <tr className={styles.SchoolsList_tr} key={i}>
              <td className={classNames(styles.SchoolsList_td, 'uk-width-1-10')}>{i+1}.</td>
              <td className={classNames(styles.SchoolsList_td, 'uk-width-7-10')}>{n.name}</td>
              <td className={classNames(styles.SchoolsList_td, 'uk-width-2-10 uk-text-right')}>
                <i onClick={() => displayEditForm(n.id)}
                   className={classNames(styles.SchoolsList_icon, 'uk-icon-pencil uk-margin-left')}></i>
                <i onClick={() => deleteSchool(n.id)}
                   className={classNames(styles.SchoolsList_icon, 'uk-icon-trash uk-margin-small-left')}></i>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

SchoolList.propTypes = {
  deleteSchool: PropTypes.func,
  displayEditForm: PropTypes.func,
  schools: PropTypes.array,
};

export default SchoolList;
