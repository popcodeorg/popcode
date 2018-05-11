import React from 'react';
import PropTypes from 'prop-types';
import {DraggableCore} from 'react-draggable';
import {connect} from 'react-redux';
import bindAll from 'lodash-es/bindAll';
import isNull from 'lodash-es/isNull';
import get from 'lodash-es/get';
import partial from 'lodash-es/partial';
import {t} from 'i18next';
import classnames from 'classnames';
import {getNodeWidth, getNodeWidths} from '../util/resize';
import {getQueryParameters, setQueryParameters} from '../util/queryParams';
import {dehydrateProject, rehydrateProject} from '../clients/localStorage';

import {
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
import EditorsColumn from '../containers/EditorsColumn';
import Output from './Output';
import PopThrobber from './PopThrobber';

function mapStateToProps(state) {
  return {
    currentProject: getCurrentProject(state),
    isDraggingColumnDivider: state.getIn(
      ['ui', 'workspace', 'isDraggingColumnDivider'],
    ),
    isEditingInstructions: isEditingInstructions(state),
    rowsFlex: state.getIn(['ui', 'workspace', 'rowFlex']).toJS(),
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
      '_storeColumnRef',
    );
    this.columnRefs = [null, null];
  }

  componentWillMount() {
    const {
      gistId,
      snapshotKey,
      isExperimental,
    } = getQueryParameters(location.search);
    const rehydratedProject = rehydrateProject();
    setQueryParameters({isExperimental});
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
    const {currentProject, rowsFlex} = this.props;
    if (isNull(currentProject)) {
      return <PopThrobber message={t('workspace.loading')} />;
    }

    return (
      <div className="environment">
        <EditorsColumn
          style={{flex: rowsFlex[0]}}
          onRef={partial(this._storeColumnRef, 0)}
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
  isDraggingColumnDivider: PropTypes.bool.isRequired,
  isEditingInstructions: PropTypes.bool.isRequired,
  rowsFlex: PropTypes.array.isRequired,
};

Workspace.defaultProps = {
  currentProject: null,
};

export default connect(mapStateToProps)(Workspace);
