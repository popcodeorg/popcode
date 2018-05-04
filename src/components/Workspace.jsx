import React from 'react';
import PropTypes from 'prop-types';
import {DraggableCore} from 'react-draggable';
import {connect} from 'react-redux';
import values from 'lodash/values';
import bindAll from 'lodash/bindAll';
import includes from 'lodash/includes';
import isNull from 'lodash/isNull';
import get from 'lodash/get';
import partial from 'lodash/partial';
import map from 'lodash/map';
import {t} from 'i18next';
import classnames from 'classnames';
import {getNodeWidth, getNodeWidths} from '../util/resize';
import {getQueryParameters, setQueryParameters} from '../util/queryParams';
import {dehydrateProject, rehydrateProject} from '../clients/localStorage';

import {
  updateProjectSource,
  hideComponent,
  unhideComponent,
  editorFocusedRequestedLine,
  dragRowDivider,
  dragColumnDivider,
  startDragColumnDivider,
  stopDragColumnDivider,
  toggleComponent,
  applicationLoaded,

} from '../actions';

import {isPristineProject} from '../util/projectUtils';
import {getCurrentProject, isEditingInstructions} from '../selectors';

import TopBar from '../containers/TopBar';
import Instructions from '../containers/Instructions';
import NotificationList from '../containers/NotificationList';
import AssignmentSelector from '../containers/AssignmentSelector';
import EditorsColumn from './EditorsColumn';
import Output from './Output';
import PopThrobber from './PopThrobber';

function mapStateToProps(state) {
  return {
    currentProject: getCurrentProject(state),
    errors: state.get('errors').toJS(),
    isDraggingColumnDivider: state.getIn(
      ['ui', 'workspace', 'isDraggingColumnDivider'],
    ),
    isEditingInstructions: isEditingInstructions(state),
    isUserTyping: state.getIn(['ui', 'editors', 'typing']),
    editorsFlex: state.getIn(['ui', 'workspace', 'columnFlex']).toJS(),
    rowsFlex: state.getIn(['ui', 'workspace', 'rowFlex']).toJS(),
    ui: state.get('ui').toJS(),
  };
}

class Workspace extends React.Component {
  constructor() {
    super();
    bindAll(
      this,
      '_handleUnload',
      '_handleClickInstructionsBar',
      '_handleComponentUnhide',
      '_handleComponentHide',
      '_handleDividerDrag',
      '_handleDividerStart',
      '_handleDividerStop',
      '_handleEditorInput',
      '_handleEditorsDividerDrag',
      '_handleRequestedLineFocused',
      '_storeDividerRef',
      '_storeColumnRef',
    );
    this.columnRefs = [null, null];
  }

  componentWillMount() {
    const {
      gistId,
      snapshotKey,
      isExperimental,
      assignmentKey,
    } = getQueryParameters(location.search);
    const rehydratedProject = rehydrateProject();
    setQueryParameters({isExperimental});
    this.props.dispatch(applicationLoaded({
      snapshotKey,
      gistId,
      isExperimental,
      rehydratedProject,
      assignmentKey,
    }));
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

  _handleComponentHide(componentName) {
    this.props.dispatch(
      hideComponent(
        this.props.currentProject.projectKey,
        componentName,
      ),
    );
  }

  _handleComponentUnhide(componentName) {
    this.props.dispatch(
      unhideComponent(
        this.props.currentProject.projectKey,
        componentName,
      ),
    );
  }

  _handleEditorInput(language, source) {
    this.props.dispatch(
      updateProjectSource(
        this.props.currentProject.projectKey,
        language,
        source,
      ),
    );
  }

  _getOverallValidationState() {
    const errorStates = map(values(this.props.errors), 'state');

    if (includes(errorStates, 'validation-error')) {
      if (this.props.isUserTyping) {
        return 'validating';
      }
      return 'validation-error';
    }

    if (includes(errorStates, 'validating')) {
      return 'validating';
    }

    if (includes(errorStates, 'runtime-error')) {
      return 'runtime-error';
    }

    return 'passed';
  }

  _renderOutput() {
    const {isDraggingColumnDivider, rowsFlex} = this.props;
    return (
      <Output
        ignorePointerEvents={
          isDraggingColumnDivider ||
            Boolean(get(this, 'props.ui.topBar.openMenu'))
        }
        style={{flex: rowsFlex[1]}}
        onRef={partial(this._storeColumnRef, 1)}
      />
    );
  }

  _handleEditorsDividerDrag(data) {
    this.props.dispatch(dragRowDivider(data));
  }

  _handleRequestedLineFocused() {
    this.props.dispatch(editorFocusedRequestedLine());
  }

  _handleClickInstructionsBar() {
    if (!this.props.isEditingInstructions) {
      this.props.dispatch(toggleComponent(
        get(this.props, ['currentProject', 'projectKey']),
        'instructions',
      ));
    }
  }

  _renderInstructionsBar() {
    const currentInstructions = get(
      this.props,
      ['currentProject', 'instructions'],
    );
    if (!this.props.isEditingInstructions && !currentInstructions) {
      return null;
    }

    return (
      <div
        className={classnames('layout__instructions-bar', {
          'layout__instructions-bar_disabled':
            this.props.isEditingInstructions,
        })}
        onClick={this._handleClickInstructionsBar}
      >
        <span
          className={classnames('u__icon', {
            u__icon_disabled: this.props.isEditingInstructions,
          })}
        >&#xf05a;</span>
      </div>
    );
  }

  _storeColumnRef(index, column) {
    this.columnRefs[index] = column;
  }

  _storeDividerRef(divider) {
    this.dividerRef = divider;
  }

  _handleDividerStart() {
    this.props.dispatch(startDragColumnDivider());
  }

  _handleDividerStop() {
    this.props.dispatch(stopDragColumnDivider());
  }

  _handleDividerDrag(_, {deltaX, lastX, x}) {
    this.props.dispatch(dragColumnDivider({
      columnWidths: getNodeWidths(this.columnRefs),
      dividerWidth: getNodeWidth(this.dividerRef),
      deltaX,
      lastX,
      x,
    }));
  }

  _renderEnvironment() {
    const {
      currentProject,
      editorsFlex,
      errors,
      rowsFlex,
      ui,
    } = this.props;
    if (isNull(currentProject)) {
      return <PopThrobber message={t('workspace.loading')} />;
    }

    return (
      <div className="environment">
        <EditorsColumn
          currentProject={currentProject}
          editorsFlex={editorsFlex}
          errors={errors}
          style={{flex: rowsFlex[0]}}
          ui={ui}
          onComponentHide={this._handleComponentHide}
          onComponentUnhide={this._handleComponentUnhide}
          onDividerDrag={this._handleEditorsDividerDrag}
          onEditorInput={this._handleEditorInput}
          onRef={partial(this._storeColumnRef, 0)}
          onRequestedLineFocused={this._handleRequestedLineFocused}
        />
        <DraggableCore
          onDrag={this._handleDividerDrag}
          onStart={this._handleDividerStart}
          onStop={this._handleDividerStop}
        >
          <div
            className="editors__column-divider"
            ref={this._storeDividerRef}
          />
        </DraggableCore>
        {this._renderOutput()}
      </div>
    );
  }

  render() {
    return (
      <div className="layout">
        <AssignmentSelector />
        <TopBar />
        <NotificationList />
        <main className="layout__columns">
          <Instructions />
          {this._renderInstructionsBar()}
          <div className="workspace layout__main">
            {this._renderEnvironment()}
          </div>
        </main>
      </div>
    );
  }
}

Workspace.propTypes = {
  currentProject: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  editorsFlex: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired,
  isDraggingColumnDivider: PropTypes.bool.isRequired,
  isEditingInstructions: PropTypes.bool.isRequired,
  isUserTyping: PropTypes.bool,
  rowsFlex: PropTypes.array.isRequired,
  ui: PropTypes.object.isRequired,
};

Workspace.defaultProps = {
  currentProject: null,
  isUserTyping: false,
};

export default connect(mapStateToProps)(Workspace);
