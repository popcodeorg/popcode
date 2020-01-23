import {faInfoCircle, faPenSquare} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import i18next from 'i18next';
import bindAll from 'lodash-es/bindAll';
import clone from 'lodash-es/clone';
import get from 'lodash-es/get';
import includes from 'lodash-es/includes';
import isNull from 'lodash-es/isNull';
import partial from 'lodash-es/partial';
import some from 'lodash-es/some';
import PropTypes from 'prop-types';
import React, {Suspense} from 'react';
import {DraggableCore} from 'react-draggable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import {dehydrateProject} from '../clients/localStorage';

import AccountMigration from '../containers/AccountMigration';
import AssignmentCreator from '../containers/AssignmentCreator';
import EditorsColumn from '../containers/EditorsColumn';
import Instructions from '../containers/Instructions';
import KeyboardHandler from '../containers/KeyboardHandler';
import LoginPrompt from '../containers/LoginPrompt';
import NotificationList from '../containers/NotificationList';
import ProjectPickerModal from '../containers/ProjectPickerModal';
import TopBar from '../containers/TopBar';
import prefix from '../services/inlineStylePrefixer';
import {LANGUAGES} from '../util/editor';
import {isPristineProject} from '../util/projectUtils';
import {RIGHT_COLUMN_COMPONENTS} from '../util/ui';

import CollapsedComponent from './CollapsedComponent';
import Output from './Output';
import PopThrobber from './PopThrobber';

export default class Workspace extends React.Component {
  constructor() {
    super();
    bindAll(
      this,
      '_handleUnload',
      '_handleClickInstructionsBar',
      '_handleClickInstructionsEditButton',
    );
    this.columnRefs = [null, null];
  }

  componentDidMount() {
    addEventListener('beforeunload', this._handleUnload);
  }

  componentWillUnmount() {
    removeEventListener('beforeunload', this._handleUnload);
  }

  _handleUnload() {
    const {currentProject} = this.props;
    if (!isNull(currentProject) && !isPristineProject(currentProject)) {
      dehydrateProject(currentProject);
    }
  }

  _handleClickInstructionsBar() {
    const {isEditingInstructions, onComponentToggle} = this.props;
    if (!isEditingInstructions) {
      onComponentToggle(
        get(this.props, ['currentProject', 'projectKey']),
        'instructions',
      );
    }
  }

  _handleClickInstructionsEditButton() {
    const {isEditingInstructions, onClickInstructionsEditButton} = this.props;
    if (!isEditingInstructions) {
      onClickInstructionsEditButton(
        get(this.props, ['currentProject', 'projectKey']),
      );
    }
  }

  _renderInstructionsBar() {
    const currentInstructions = get(this.props, [
      'currentProject',
      'instructions',
    ]);
    if (!this.props.isEditingInstructions && !currentInstructions) {
      return null;
    }

    const isInstructionsHidden = get(this.props, [
      'currentProject',
      'hiddenUIComponents',
    ]).includes('instructions');

    return (
      <div
        className={classnames('layout__instructions-bar', {
          'layout__instructions-bar_disabled': this.props.isEditingInstructions,
        })}
        onClick={this._handleClickInstructionsBar}
      >
        <FontAwesomeIcon
          fixedWidth
          className={classnames({
            u__pointer: !this.props.isEditingInstructions,
          })}
          icon={faInfoCircle}
        />
        {!isInstructionsHidden && !this.props.isEditingInstructions && (
          <FontAwesomeIcon
            fixedWidth
            className="layout__instructions-bar-edit-button"
            icon={faPenSquare}
            onClick={e => {
              e.stopPropagation();
              this._handleClickInstructionsEditButton();
            }}
          />
        )}
      </div>
    );
  }

  _renderHiddenLanguages() {
    const {currentProject, hiddenLanguages, onComponentToggle} = this.props;
    const isRightJustified = !this._isSingleColumn();
    return (
      <>
        {hiddenLanguages.map(({language}) => (
          <CollapsedComponent
            component={`editor.${language}`}
            isRightJustified={isRightJustified}
            key={language}
            projectKey={currentProject.projectKey}
            text={i18next.t(`languages.${language}`)}
            onComponentUnhide={onComponentToggle}
          />
        ))}
      </>
    );
  }

  _renderHiddenRightColumnComponents() {
    const {currentProject, hasErrors, onComponentToggle, title} = this.props;
    // Errors take over the whole right side of the screen
    if (hasErrors) {
      return null;
    }
    return RIGHT_COLUMN_COMPONENTS.filter(component =>
      includes(currentProject.hiddenUIComponents, component),
    ).map(component => {
      switch (component) {
        case 'console':
          return (
            <CollapsedComponent
              component="console"
              isRightJustified={false}
              key="console"
              projectKey={currentProject.projectKey}
              text={i18next.t('workspace.components.console')}
              onComponentUnhide={onComponentToggle}
            />
          );
        case 'preview':
          return (
            <CollapsedComponent
              component="preview"
              isRightJustified={false}
              key="preview"
              projectKey={currentProject.projectKey}
              text={title}
              onComponentUnhide={onComponentToggle}
            />
          );
        default:
          return null;
      }
    });
  }

  _shouldRenderLeftColumn() {
    return this.props.hiddenLanguages.length !== LANGUAGES.length;
  }

  _shouldRenderRightColumn() {
    const {currentProject, shouldRenderOutput} = this.props;
    return (
      shouldRenderOutput ||
      some(
        RIGHT_COLUMN_COMPONENTS,
        component => !includes(currentProject.hiddenUIComponents, component),
      )
    );
  }

  _isSingleColumn() {
    const shouldRenderLeft = this._shouldRenderLeftColumn();
    const shouldRenderRight = this._shouldRenderRightColumn();
    return (
      this._isEverythingHidden() ||
      (shouldRenderLeft && !shouldRenderRight) ||
      (!shouldRenderLeft && shouldRenderRight)
    );
  }

  _isEverythingHidden() {
    return !this._shouldRenderLeftColumn() && !this._shouldRenderRightColumn();
  }

  _renderEverythingHidden() {
    return (
      <div className="environment__column">
        {this._renderHiddenRightColumnComponents()}
        {this._renderHiddenLanguages()}
      </div>
    );
  }
  _renderEnvironment() {
    const {
      currentProject,
      isAnyTopBarMenuOpen,
      isDraggingColumnDivider,
      isFlexResizingSupported,
      resizableFlexGrow,
      resizableFlexRefs,
      onResizableFlexDividerDrag,
      onStartDragColumnDivider,
      onStopDragColumnDivider,
      shouldRenderOutput,
    } = this.props;
    if (isNull(currentProject)) {
      return <PopThrobber message={i18next.t('workspace.loading')} />;
    }

    const [_handleEditorsRef, _handleOutputRef] = resizableFlexRefs;
    const ignorePointerEvents = isDraggingColumnDivider || isAnyTopBarMenuOpen;
    return (
      <Suspense
        fallback={<PopThrobber message={i18next.t('workspace.loading')} />}
      >
        <div className="environment">
          {this._shouldRenderLeftColumn() && (
            <>
              <div
                className="environment__column"
                ref={_handleEditorsRef}
                style={prefix(clone({flexGrow: resizableFlexGrow.get(0)}))}
              >
                <div className="environment__column-contents">
                  <div className="environment__column-contents-inner">
                    <EditorsColumn />
                    {!this._shouldRenderRightColumn() &&
                      this._renderHiddenRightColumnComponents()}
                    {this._renderHiddenLanguages()}
                  </div>
                </div>
              </div>
              <DraggableCore
                onDrag={partial(onResizableFlexDividerDrag, 0)}
                onStart={onStartDragColumnDivider}
                onStop={onStopDragColumnDivider}
              >
                <div
                  className={classnames('editors__column-divider', {
                    'editors__column-divider_draggable': isFlexResizingSupported,
                  })}
                />
              </DraggableCore>
            </>
          )}
          {this._shouldRenderRightColumn() && (
            <div
              className="environment__column"
              ref={_handleOutputRef}
              style={prefix({
                flexGrow: resizableFlexGrow.get(1),
                pointerEvents: ignorePointerEvents ? 'none' : 'all',
              })}
            >
              <div className="environment__column-contents">
                <div className="environment__column-contents-inner">
                  {shouldRenderOutput && <Output />}
                  {this._renderHiddenRightColumnComponents()}
                  {!this._shouldRenderLeftColumn() &&
                    this._renderHiddenLanguages()}
                </div>
              </div>
            </div>
          )}
          {this._isEverythingHidden() && this._renderEverythingHidden()}
        </div>
      </Suspense>
    );
  }

  render() {
    return (
      <>
        <div className="layout">
          <AssignmentCreator />
          <TopBar />
          <NotificationList />
          <ProjectPickerModal />
          <div className="layout__columns">
            <Instructions />
            {this._renderInstructionsBar()}
            <div className="workspace layout__main">
              {this._renderEnvironment()}
            </div>
          </div>
          <AccountMigration />
          <LoginPrompt />
        </div>
        <KeyboardHandler />
      </>
    );
  }
}

Workspace.propTypes = {
  currentProject: PropTypes.object,
  hasErrors: PropTypes.bool.isRequired,
  hiddenLanguages: PropTypes.array.isRequired,
  isAnyTopBarMenuOpen: PropTypes.bool.isRequired,
  isDraggingColumnDivider: PropTypes.bool.isRequired,
  isEditingInstructions: PropTypes.bool.isRequired,
  isFlexResizingSupported: PropTypes.bool.isRequired,
  resizableFlexGrow: ImmutablePropTypes.list.isRequired,
  resizableFlexRefs: PropTypes.array.isRequired,
  shouldRenderOutput: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onClickInstructionsEditButton: PropTypes.func.isRequired,
  onComponentToggle: PropTypes.func.isRequired,
  onResizableFlexDividerDrag: PropTypes.func.isRequired,
  onStartDragColumnDivider: PropTypes.func.isRequired,
  onStopDragColumnDivider: PropTypes.func.isRequired,
};

Workspace.defaultProps = {
  currentProject: null,
};
