import React from 'react';
import PropTypes from 'prop-types';
import {DraggableCore} from 'react-draggable';
import {connect} from 'react-redux';
import values from 'lodash/values';
import bindAll from 'lodash/bindAll';
import includes from 'lodash/includes';
import isNull from 'lodash/isNull';
import get from 'lodash/get';
import map from 'lodash/map';
import {t} from 'i18next';
import qs from 'qs';
import {
  getNodeWidth,
  getNodeWidths,
} from '../util/resize';
import {dehydrateProject, rehydrateProject} from '../clients/localStorage';

import {
  dragDivider,
  startDragDivider,
  stopDragDivider,
  storeDividerRef,
  toggleComponent,
  applicationLoaded,
} from '../actions';

import {isPristineProject} from '../util/projectUtils';
import {
  getCurrentProject,
  makeGetDividerRefs,
  getErrors,
  makeGetResizableSectionRefs,
  isUserTyping,
} from '../selectors';
import TopBar from '../containers/TopBar';
import Instructions from '../containers/Instructions';
import NotificationList from '../containers/NotificationList';
import Output from '../containers/Output';
import EditorsColumn from '../containers/EditorsColumn';
import PopThrobber from './PopThrobber';

function mapStateToProps(state) {
  const getResizableSectionRefs = makeGetResizableSectionRefs();
  const getDividerRefs = makeGetDividerRefs();
  return {
    environmentColumnDividerRefs: getDividerRefs(state, 'columns'),
    environmentColumnRefs: getResizableSectionRefs(state, 'columns'),
    currentProject: getCurrentProject(state),
    errors: getErrors(state),
    isUserTyping: isUserTyping(state),
  };
}

class Workspace extends React.Component {
  constructor() {
    super();
    bindAll(
      this,
      '_handleUnload',
      '_handleClickInstructionsBar',
      '_handleDividerDrag',
      '_handleDividerStart',
      '_handleDividerStop',
      '_storeDividerRef',
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

  _storeDividerRef(ref) {
    this.props.dispatch(storeDividerRef('columns', 0, ref));
  }

  _handleDividerStart() {
    this.props.dispatch(startDragDivider('columns'));
  }

  _handleDividerStop() {
    this.props.dispatch(stopDragDivider('columns'));
  }

  _handleDividerDrag(_, {deltaX, lastX, x}) {
    this.props.dispatch(dragDivider('columns', {
      columnWidths: getNodeWidths(this.props.environmentColumnRefs),
      dividerWidth: getNodeWidth(this.props.environmentColumnDividerRefs[0]),
      deltaX,
      lastX,
      x,
    }));
  }

  _renderEnvironment() {
    if (isNull(this.props.currentProject)) {
      return <PopThrobber message={t('workspace.loading')} />;
    }

    return (
      <div className="environment">
        <EditorsColumn />
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
  environmentColumnDividerRefs: PropTypes.array.isRequired,
  environmentColumnRefs: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired,
  isUserTyping: PropTypes.bool,
};

Workspace.defaultProps = {
  currentProject: null,
  isUserTyping: false,
};

export default connect(mapStateToProps)(Workspace);
