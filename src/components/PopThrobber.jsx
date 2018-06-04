import React from 'react';
import PropTypes from 'prop-types';

import Pop from './Pop';

function PopThrobber(props) {
  return (
    <div className="pop-throbber">
      {
        props.message ?
          <div className="pop-throbber__message">{props.message}</div> :
          null
      }
      <Pop variant="thinking" />
    </div>
  );
}

PopThrobber.propTypes = {
  message: PropTypes.string,
};

PopThrobber.defaultProps = {
  message: null,
};

export default PopThrobber;
