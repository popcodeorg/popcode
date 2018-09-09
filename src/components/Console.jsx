import classnames from 'classnames';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import partial from 'lodash-es/partial';
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import {EditorLocation} from '../records';

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
  const console = (
    <div
      className="console__scroll-container output__item"
      onClick={onConsoleClicked}
    >
      <div
        className={
          classnames('console__repl', {console__repl_zoomed: isTextSizeLarge})
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

  const chevron = isOpen ? 'chevron-down' : 'chevron-up';

  return (
    <div
      className={classnames(
        'console',
        {u__hidden: isHidden},
      )}
    >
      <div
        className="label console__label"
        onClick={partial(onToggleVisible, currentProjectKey)}
      >
        <div>
          Console
          {' '}
          <FontAwesomeIcon icon={chevron} />
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClearConsoleEntries();
          }}
        >
          <FontAwesomeIcon icon="ban" />
        </div>
      </div>
      {isOpen ? console : null}
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
