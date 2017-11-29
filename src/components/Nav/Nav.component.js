import React, {Component} from 'react';
import {Link} from 'react-router';
import classNames from 'classnames';
import styles from'./Nav.stylesheet.css';

class Nav extends Component {
  render() {
    return (
      <div className={classNames(styles.NavWrapper, 'uk-width-1-6')}>
        <ul className={classNames('uk-nav', styles.Nav)}>
          <li className={styles.Nav_listElem}>
            <Link to='schools' activeClassName={styles.activeLink} className={styles.Nav__link}>
                <i className="uk-icon-building uk-icon-small"></i>
                <span className={styles.Nav_label}>
                  Szkoły
                </span>
            </Link>
          </li>
          <li className={styles.Nav_listElem}>
            <Link to='swimmers' activeClassName={styles.activeLink} className={styles.Nav__link}>
                <i className="uk-icon-group uk-icon-small"></i>
                <span className={styles.Nav_label}>
                  Zawodnicy
                </span>
            </Link>
          </li>
          <li className={styles.Nav_listElem}>
            <Link to='' activeClassName={styles.activeLink} className={styles.Nav__link}>
                <i className="uk-icon-home uk-icon-small"></i>
                <span className={styles.Nav_label}>
                  Zawody
                </span>
            </Link>
          </li>
          <li className={styles.Nav_listElem}>
            <Link to='times' activeClassName={styles.activeLink} className={styles.Nav__link}>
                <i className="uk-icon-table uk-icon-small"></i>
                <span className={styles.Nav_label}>
                  Wyniki
                </span>
            </Link>
          </li>
          <li className={styles.Nav_listElem}>
            <Link to='classifications' activeClassName={styles.activeLink} className={styles.Nav__link}>
                <i className="uk-icon-bar-chart uk-icon-small"></i>
                <span className={styles.Nav_label}>
                  Ranking zawodów
                </span>
            </Link>
          </li>
          <li className={styles.Nav_listElem}>
            <Link to='general-rankings' activeClassName={styles.activeLink} className={styles.Nav__link}>
                <i className="uk-icon-trophy uk-icon-small"></i>
                <span className={styles.Nav_label}>
                  Ranking ogólny
                </span>
            </Link>
          </li>
          <li className={styles.Nav_listElem}>
            <Link to='records' activeClassName={styles.activeLink} className={styles.Nav__link}>
                <i className="uk-icon-clock-o uk-icon-small"></i>
                <span className={styles.Nav_label}>
                  Rekordy
                </span>
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default Nav;
