import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';

export default function GenericNotification(props) {
  return (
    <span>{t(`notifications.${props.type}`, props.payload)}</span>
  );
}

GenericNotification.propTypes = {
  payload: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};
