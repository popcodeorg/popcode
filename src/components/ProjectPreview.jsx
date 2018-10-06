import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {t} from 'i18next';

const MAX_LENGTH = 50;

export default function ProjectPreview({preview, project}) {
  return (
    <div>
      <div className="project-preview__label">
        {preview.slice(0, MAX_LENGTH)}
      </div>
      <div className="project-preview__timestamp">
        {project.updatedAt ?
          moment(project.updatedAt).fromNow() : t('top-bar.pristine-project')}
      </div>
    </div>
  );
}

ProjectPreview.propTypes = {
  preview: PropTypes.string.isRequired,
  project: PropTypes.object.isRequired,
};
