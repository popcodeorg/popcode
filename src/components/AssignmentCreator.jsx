import {t} from 'i18next';
import React, {lazy, Suspense} from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import Modal from './Modal';

const AssignmentCreatorForm = lazy(
  () => import(
    /* webpackChunkName: "mainAsync" */
    '../containers/AssignmentCreatorForm' // eslint-disable-line comma-dangle
  ),
);

export default function AssignmentCreator({
  areCoursesLoaded,
  courses,
  isOpen,
  parsedDate,
  projectTitle,
  onAssignAssignment,
  onCloseAssignmentCreator,
  onDraftAssignment,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <Suspense fallback="Loading...">
      <Modal>
        <div className="assignment-creator">
          <h1 className="assignment-creator__title">
            {t('assignment-creator.title')}
          </h1>
          <h3 className="assignment-creator__project-name">
            {projectTitle}
          </h3>
          {
            areCoursesLoaded ?
              <AssignmentCreatorForm
                courses={courses}
                parsedDate={parsedDate}
                onAssignAssignment={onAssignAssignment}
                onCloseAssignmentCreator={onCloseAssignmentCreator}
                onDraftAssignment={onDraftAssignment}
              /> :
              <FontAwesomeIcon icon={faSpinner} key="icon" />
          }
        </div>
      </Modal>
    </Suspense>
  );
}

AssignmentCreator.propTypes = {
  areCoursesLoaded: PropTypes.bool.isRequired,
  courses: ImmutablePropTypes.iterable.isRequired,
  isOpen: PropTypes.bool.isRequired,
  parsedDate: PropTypes.instanceOf(Date),
  projectTitle: PropTypes.string,
  onAssignAssignment: PropTypes.func.isRequired,
  onCloseAssignmentCreator: PropTypes.func.isRequired,
  onDraftAssignment: PropTypes.func.isRequired,
};

AssignmentCreator.defaultProps = {
  parsedDate: null,
  projectTitle: null,
};
