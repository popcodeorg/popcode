import React from 'react';
import Pop from './Pop';

function PopThrobber(props) {
  return (
    <div className="pop-spinner">
      <div className="pop-spinner__message">{props.message}</div>
      <Pop variant="thinking" />
    </div>
  );
}

PopThrobber.propTypes = {
  message: React.PropTypes.string.isRequired,
};

export default PopThrobber;
