import React from 'react';
import PropTypes from 'prop-types';
import {DraggableCore} from 'react-draggable';
import bindAll from 'lodash-es/bindAll';
import isNull from 'lodash-es/isNull';
import get from 'lodash-es/get';
import partial from 'lodash-es/partial';
import {t} from 'i18next';
import classnames from 'classnames';

import {getNodeWidth, getNodeWidths} from '../util/resize';
import {getQueryParameters, setQueryParameters} from '../util/queryParams';
import {dehydrateProject, rehydrateProject} from '../clients/localStorage';

import {isPristineProject} from '../util/projectUtils';

import TopBar from '../containers/TopBar';
import Instructions from '../containers/Instructions';
import NotificationList from '../containers/NotificationList';
import EditorsColumn from '../containers/EditorsColumn';
import Output from '../containers/Output';

import PopThrobber from './PopThrobber';

export default class Workspace extends React.Component {
  constructor() {
    super();
    bindAll(
      this,
      '_handleUnload',
      '_handleClickInstructionsBar',
      '_handleDividerDrag',
      '_storeDividerRef',
      '_storeColumnRef',
    );
    this.columnRefs = [null, null];
  }

  componentDidMount() {
    const {onApplicationLoaded} = this.props;
    const {
      gistId,
      snapshotKey,
      isExperimental,
    } = getQueryParameters(location.search);
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

  _handleDividerDrag(_, {deltaX, lastX, x}) {
    const {onDragColumnDivider} = this.props;
    onDragColumnDivider({
      columnWidths: getNodeWidths(this.columnRefs),
      dividerWidth: getNodeWidth(this.dividerRef),
      deltaX,
      lastX,
      x,
    });
  }

  _renderEnvironment() {
    const {
      currentProject,
      onStartDragColumnDivider,
      onStopDragColumnDivider,
      rowsFlex,
    } = this.props;
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
          onStart={onStartDragColumnDivider}
          onStop={onStopDragColumnDivider}
        >
          <div
            className="editors__column-divider"
            ref={this._storeDividerRef}
          />
        </DraggableCore>
        <Output
          style={{flex: rowsFlex[1]}}
          onRef={partial(this._storeColumnRef, 1)}
        />
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
  isEditingInstructions: PropTypes.bool.isRequired,
  rowsFlex: PropTypes.array.isRequired,
  onApplicationLoaded: PropTypes.func.isRequired,
  onComponentToggle: PropTypes.func.isRequired,
  onDragColumnDivider: PropTypes.func.isRequired,
  onStartDragColumnDivider: PropTypes.func.isRequired,
  onStopDragColumnDivider: PropTypes.func.isRequired,
};

Workspace.defaultProps = {
  currentProject: null,
};
