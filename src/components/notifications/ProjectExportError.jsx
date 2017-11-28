import React from 'react';
import PropTypes from 'prop-types';
import {t} from 'i18next';

export default function ProjectExportError({payload}) {
  return (
    <span>
      {t(`notifications.${payload.exportType}-export-error`)}
    </span>
  );
}

ProjectExportError.propTypes = {
  payload: PropTypes.object.isRequired,
};
