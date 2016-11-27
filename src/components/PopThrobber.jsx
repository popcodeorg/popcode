import React from 'react';
import Isvg from 'react-inlinesvg';

function PopThrobber(props) {
  return (
    <div className="pop-spinner">
      <div className="pop-spinner__message">{props.message}</div>
      <Isvg src="/images/pop/thinking.svg" />
    </div>
  );
}

PopThrobber.propTypes = {
  message: React.PropTypes.string.isRequired,
};

export default PopThrobber;
