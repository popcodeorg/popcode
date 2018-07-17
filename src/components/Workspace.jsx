import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {DraggableCore} from 'react-draggable';
import bindAll from 'lodash-es/bindAll';
import isNull from 'lodash-es/isNull';
import get from 'lodash-es/get';
import partial from 'lodash-es/partial';
import {t} from 'i18next';
import classnames from 'classnames';

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

  _renderEnvironment() {
    const {
      currentProject,
      resizableFlexGrow,
      resizableFlexRefs,
      onResizableFlexDividerDrag,
      onStartDragColumnDivider,
      onStopDragColumnDivider,
    } = this.props;
    if (isNull(currentProject)) {
      return <PopThrobber message={t('workspace.loading')} />;
    }

    const [_handleEditorsRef, _handleOutputRef] = resizableFlexRefs;

    return (
      <div className="environment">
        <EditorsColumn
          style={{flexGrow: resizableFlexGrow.get(0)}}
          onRef={_handleEditorsRef}
        />
        <DraggableCore
          onDrag={partial(onResizableFlexDividerDrag, 0)}
          onStart={onStartDragColumnDivider}
          onStop={onStopDragColumnDivider}
        >
          <div
            className="editors__column-divider"
          />
        </DraggableCore>
        <Output
          style={{flexGrow: resizableFlexGrow.get(1)}}
          onRef={_handleOutputRef}
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
  resizableFlexGrow: ImmutablePropTypes.list.isRequired,
  resizableFlexRefs: PropTypes.array.isRequired,
  onApplicationLoaded: PropTypes.func.isRequired,
  onComponentToggle: PropTypes.func.isRequired,
  onResizableFlexDividerDrag: PropTypes.func.isRequired,
  onStartDragColumnDivider: PropTypes.func.isRequired,
  onStopDragColumnDivider: PropTypes.func.isRequired,
};

Workspace.defaultProps = {
  currentProject: null,
};
