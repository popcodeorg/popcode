import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import isNil from 'lodash-es/isNil';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import {ConsoleEntry} from '../records';

import styles from './ConsoleOutput.module.css';

export default function ConsoleOutput({entry, isActive}) {
  const {expression, value, error} = entry;
  const chevron = expression ?
    (<div className={styles.chevron}>
      <FontAwesomeIcon icon={faChevronLeft} />
    </div>) :
    null;

  if (!isNil(value)) {
    return (
      <div
        className={
          classnames(
            styles.value,
            {[styles.inactive]: !isActive},
          )
        }
      >
        {chevron}
        {value}
      </div>
    );
  }

  if (!isNil(error)) {
    return (
      <div
        className={
          classnames(
            styles.error,
            {[styles.inactive]: !isActive},
          )
        }
      >
        {error.text}
      </div>
    );
  }

  return null;
}

ConsoleOutput.propTypes = {
  entry: PropTypes.instanceOf(ConsoleEntry).isRequired,
  isActive: PropTypes.bool.isRequired,
};
