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
import qs from 'qs';
import {
  getNodeWidth,
  getNodeWidths,
} from '../util/resize';
import {dehydrateProject, rehydrateProject} from '../clients/localStorage';

import {
  updateProjectSource,
  hideComponent,
  unhideComponent,
  focusLine,
  editorFocusedRequestedLine,
  dragDivider,
  startDragDivider,
  stopDragDivider,
  storeResizableSectionRef,
  storeDividerRef,
  toggleComponent,
  applicationLoaded,
} from '../actions';

import {isPristineProject} from '../util/projectUtils';
import {getCurrentProject} from '../selectors';

import TopBar from '../containers/TopBar';
import Instructions from '../containers/Instructions';
import NotificationList from '../containers/NotificationList';
import EditorsColumn from './EditorsColumn';
import Output from '../containers/Output';
import PopThrobber from './PopThrobber';

function mapStateToProps(state) {
  return {
    currentProject: getCurrentProject(state),
    errors: state.get('errors').toJS(),
    isDraggingColumnDivider: state.getIn(
      ['ui', 'workspace', 'columns','isDraggingDivider'],
    ),
    isUserTyping: state.getIn(['ui', 'editors', 'typing']),
    editorsFlex: state.getIn(['ui', 'workspace', 'editors', 'flex']).toJS(),
    rowsFlex: state.getIn(['ui', 'workspace', 'columns', 'flex']).toJS(),
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
      '_handleEditorsDividerDrag',
      '_handleDividerStart',
      '_handleDividerStop',
      '_handleEditorInput',
      '_handleErrorClick',
      '_handleRequestedLineFocused',
      '_storeDividerRef',
      '_storeColumnRef',
      '_storeEditorRef',
    );
  }

  componentWillMount() {
    let gistId = null;
    let snapshotKey = null;
    let isExperimental = false;
    if (location.search) {
      const query = qs.parse(location.search.slice(1));
      if (query.gist) {
        gistId = query.gist;
      }
      if (query.snapshot) {
        snapshotKey = query.snapshot;
      }
      isExperimental = Object.keys(query).includes('experimental');
    }
    const rehydratedProject = rehydrateProject();
    history.replaceState({}, '', location.pathname);
    this.props.dispatch(applicationLoaded({
      snapshotKey,
      gistId,
      isExperimental,
      rehydratedProject,
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
    console.log(componentName)
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

  _handleErrorClick(language, line, column) {
    this.props.dispatch(focusLine(language, line, column));
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

  _handleEditorsDividerDrag(data) {
    this.props.dispatch(dragDivider('editors', data));
  }

  _handleRequestedLineFocused() {
    this.props.dispatch(editorFocusedRequestedLine());
  }

  _handleClickInstructionsBar() {
    this.props.dispatch(toggleComponent(
      get(this.props, ['currentProject', 'projectKey']),
      'instructions',
    ));
  }

  _renderInstructionsBar() {
    if (!get(this.props, ['currentProject', 'instructions'])) {
      return null;
    }

    return (
      <div
        className="layout__instructions-bar"
        onClick={this._handleClickInstructionsBar}
      >
        <span className="u__icon">&#xf05a;</span>
      </div>
    );
  }

  _storeColumnRef(ref) {
    this.props.dispatch(storeResizableSectionRef('columns', 0, ref));
  }

  _storeDividerRef(ref) {
    this.props.dispatch(storeDividerRef('columns', ref));
  }

  _handleDividerStart() {
    this.props.dispatch(startDragDivider('columns'));
  }

  _handleDividerStop() {
    this.props.dispatch(stopDragDivider('columns'));
  }

  _handleDividerDrag(_, {deltaX, lastX, x}) {
    console.log(this.props.ui.workspace.columns.refs);
    this.props.dispatch(dragDivider('columns', {
      columnWidths: getNodeWidths(this.props.ui.workspace.columns.refs),
      dividerWidth: getNodeWidth(this.props.ui.workspace.columns.dividerRef),
      deltaX,
      lastX,
      x,
    }));
  }

  _storeEditorRef(index, ref) {
      console.log(index, ref );
      // this.props.dispatch(storeResizableSectionRef('editors', index, ref));
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
          onRef={this._storeColumnRef}
          onRequestedLineFocused={this._handleRequestedLineFocused}
          // onStoreEditorRef={this._storeEditorRef}
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
        <Output />
      </div>
    );
  }

  render() {
    return (
      <div className="layout">
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
  isUserTyping: PropTypes.bool,
  rowsFlex: PropTypes.array.isRequired,
  ui: PropTypes.object.isRequired,
};

Workspace.defaultProps = {
  currentProject: null,
  isUserTyping: false,
};

export default connect(mapStateToProps)(Workspace);
