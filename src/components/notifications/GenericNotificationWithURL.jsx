import React from 'react';
import PropTypes from 'prop-types';

export default function GenericNotificationWithURL(props) {
  return (
    <span>
      {props.text} {' '}
      <a href={props.url} rel="noopener noreferrer" target="_blank">
        {props.urlText}
      </a>
    </span>
  );
}

GenericNotificationWithURL.propTypes = {
  text: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  urlText: PropTypes.string.isRequired,
};
