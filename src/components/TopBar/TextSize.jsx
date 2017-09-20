import React from 'react';
import PropTypes from 'prop-types';

export default function TextSize({isLarge, onToggle}) {
  return (
    <div
      className="top-bar__menu-button top-bar__text-size"
      onClick={onToggle}
    >
      {
        isLarge ?
          <span className="u__icon">&#xf010;</span> :
          <span className="u__icon">&#xf00e;</span>
      }
    </div>
  );
}

TextSize.propTypes = {
  isLarge: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};
