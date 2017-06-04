import React from 'react';
import PropTypes from 'prop-types';
import Pop from './Pop';

function PopThrobber(props) {
  return (
    <div className="pop-throbber">
      <div className="pop-throbber__message">{props.message}</div>
      <Pop variant="thinking" />
    </div>
  );
}

PopThrobber.propTypes = {
  message: PropTypes.string.isRequired,
};

export default PopThrobber;
