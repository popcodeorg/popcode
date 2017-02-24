import React from 'react';
import {t} from 'i18next';

export default function GenericNotification(props) {
  return (
    <span>{t(`notifications.${props.type}`, props.payload)}</span>
  );
}

GenericNotification.propTypes = {
  payload: React.PropTypes.object.isRequired,
  type: React.PropTypes.string.isRequired,
};
