import React from 'react';
import i18n from 'i18next';

export default function GenericNotification(props) {
  return (
    <span>{i18n.t(`notifications.${props.type}`, props.payload)}</span>
  );
}

GenericNotification.propTypes = {
  payload: React.PropTypes.object.isRequired,
  type: React.PropTypes.string.isRequired,
};
