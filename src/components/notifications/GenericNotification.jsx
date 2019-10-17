import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import i18next from 'i18next';

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
