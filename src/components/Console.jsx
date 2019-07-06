import classnames from 'classnames';
import {
  faBan,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import partial from 'lodash-es/partial';
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {t} from 'i18next';

import {EditorLocation} from '../records';

import styles from './Console.module.css';
import ConsoleEntry from './ConsoleEntry';
import ConsoleInput from './ConsoleInput';

export default function Console({
  currentCompiledProjectKey,
  currentInputValue,
  currentProjectKey,
  history,
  isHidden,
  isOpen,
  isTextSizeLarge,
  onChange,
  onClearConsoleEntries,
  onConsoleClicked,
  onInput,
  onNextConsoleHistory,
  onPreviousConsoleHistory,
  onRequestedLineFocused,
  onToggleVisible,
  requestedFocusedLine,
}) {
  if (!isOpen) {
    return null;
  }

  const console = (
    <div
      className={styles.scrollContainer}
      onClick={onConsoleClicked}
    >
      <div
        className={
          classnames(styles.repl, {[styles.zoomed]: isTextSizeLarge})

        }
      >
        <ConsoleInput
          currentInputValue={currentInputValue}
          isTextSizeLarge={isTextSizeLarge}
          requestedFocusedLine={requestedFocusedLine}
          onChange={onChange}
          onInput={onInput}
          onNextConsoleHistory={onNextConsoleHistory}
          onPreviousConsoleHistory={onPreviousConsoleHistory}
          onRequestedLineFocused={onRequestedLineFocused}
        />
        {history.map((entry, key) => {
          const isActive =
            currentCompiledProjectKey === entry.evaluatedByCompiledProjectKey;
          return (
            // eslint-disable-next-line react/no-array-index-key
            <ConsoleEntry entry={entry} isActive={isActive} key={key} />
          );
        }).valueSeq().reverse()}
      </div>
    </div>
  );

  return (
    <div
      className={classnames(
        styles.console,
        {u__hidden: isHidden},
      )}
    >
      <div
        className={styles.label}
        onClick={partial(onToggleVisible, currentProjectKey)}
      >
        <div>
          {t('workspace.components.console')}
          {' '}
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClearConsoleEntries();
          }}
        >
          <FontAwesomeIcon icon={faBan} />
        </div>
      </div>
      {console}
    </div>
  );
}

Console.propTypes = {
  currentCompiledProjectKey: PropTypes.number,
  currentInputValue: PropTypes.string.isRequired,
  currentProjectKey: PropTypes.string.isRequired,
  history: ImmutablePropTypes.iterable.isRequired,
  isHidden: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isTextSizeLarge: PropTypes.bool,
  requestedFocusedLine: PropTypes.instanceOf(EditorLocation),
  onChange: PropTypes.func.isRequired,
  onClearConsoleEntries: PropTypes.func.isRequired,
  onConsoleClicked: PropTypes.func.isRequired,
  onInput: PropTypes.func.isRequired,
  onNextConsoleHistory: PropTypes.func.isRequired,
  onPreviousConsoleHistory: PropTypes.func.isRequired,
  onRequestedLineFocused: PropTypes.func.isRequired,
  onToggleVisible: PropTypes.func.isRequired,
};

Console.defaultProps = {
  currentCompiledProjectKey: null,
  requestedFocusedLine: null,
  isTextSizeLarge: false,
};
