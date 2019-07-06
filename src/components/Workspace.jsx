import {faInfoCircle, faPenSquare} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {DraggableCore} from 'react-draggable';
import bindAll from 'lodash-es/bindAll';
import clone from 'lodash-es/clone';
import includes from 'lodash-es/includes';
import isNull from 'lodash-es/isNull';
import get from 'lodash-es/get';
import partial from 'lodash-es/partial';
import some from 'lodash-es/some';
import {t} from 'i18next';
import classnames from 'classnames';

import prefix from '../services/inlineStylePrefixer';
import {getQueryParameters, setQueryParameters} from '../util/queryParams';
import {LANGUAGES} from '../util/editor';
import {RIGHT_COLUMN_COMPONENTS} from '../util/ui';
import {dehydrateProject, rehydrateProject} from '../clients/localStorage';

import {isPristineProject} from '../util/projectUtils';

import AccountMigration from '../containers/AccountMigration';
import AssignmentCreator from '../containers/AssignmentCreator';
import TopBar from '../containers/TopBar';
import Instructions from '../containers/Instructions';
import NotificationList from '../containers/NotificationList';
import EditorsColumn from '../containers/EditorsColumn';

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
    const {onApplicationLoaded} = this.props;
    const {gistId, snapshotKey, isExperimental} = getQueryParameters(
      location.search,
    );
    const rehydratedProject = rehydrateProject();

    setQueryParameters({isExperimental});

    onApplicationLoaded({
      snapshotKey,
      gistId,
      isExperimental,
      rehydratedProject,
    });

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
    return (
      <>
        {hiddenLanguages.map(({language}) => (
          <CollapsedComponent
            component={`editor.${language}`}
            key={language}
            projectKey={currentProject.projectKey}
            text={t(`languages.${language}`)}
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
              text={t('workspace.components.console')}
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
      return <PopThrobber message={t('workspace.loading')} />;
    }

    const [_handleEditorsRef, _handleOutputRef] = resizableFlexRefs;
    const ignorePointerEvents = isDraggingColumnDivider || isAnyTopBarMenuOpen;
    return (
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
          <>
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
          </>
        )}
        {this._isEverythingHidden() && this._renderEverythingHidden()}
      </div>
    );
  }

  render() {
    return (
      <div className="layout">
        <AssignmentCreator />
        <TopBar />
        <NotificationList />
        <div className="layout__columns">
          <Instructions />
          {this._renderInstructionsBar()}
          <div className="workspace layout__main">
            {this._renderEnvironment()}
          </div>
        </div>
        <AccountMigration />
      </div>
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
  onApplicationLoaded: PropTypes.func.isRequired,
  onClickInstructionsEditButton: PropTypes.func.isRequired,
  onComponentToggle: PropTypes.func.isRequired,
  onResizableFlexDividerDrag: PropTypes.func.isRequired,
  onStartDragColumnDivider: PropTypes.func.isRequired,
  onStopDragColumnDivider: PropTypes.func.isRequired,
};

Workspace.defaultProps = {
  currentProject: null,
};
