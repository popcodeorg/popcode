import i18next from 'i18next';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

export default function GenericNotification(props) {
  return (
    <span>
      {i18next.t(`notifications.${props.type}`, props.metadata.toObject())}
    </span>
  );
}

GenericNotification.propTypes = {
  metadata: ImmutablePropTypes.map.isRequired,
  type: PropTypes.string.isRequired,
};
