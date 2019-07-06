import {faSearchMinus, faSearchPlus} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';
import PropTypes from 'prop-types';

export default function TextSize({isLarge, onToggle}) {
  const icon = isLarge ? faSearchMinus : faSearchPlus;

  return (
    <div className="top-bar__menu-button top-bar__text-size" onClick={onToggle}>
      <FontAwesomeIcon icon={icon} />
    </div>
  );
}

TextSize.propTypes = {
  isLarge: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};
