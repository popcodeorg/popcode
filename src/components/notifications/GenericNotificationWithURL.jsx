import React from 'react';
import PropTypes from 'prop-types';

export default function GenericNotificationWithURL(props) {
  return (
    <span>
      {props.text} {' '}
      <a href={props.payload.url} rel="noopener noreferrer" target="_blank">
        {props.urlText}
      </a>
    </span>
  );
}

GenericNotificationWithURL.propTypes = {
  payload: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  urlText: PropTypes.string.isRequired,
};
