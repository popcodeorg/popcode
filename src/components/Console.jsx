import classnames from 'classnames';
import partial from 'lodash/partial';
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ConsoleEntry from './ConsoleEntry';
import ConsoleInput from './ConsoleInput';

export default function Console({
  currentProjectKey,
  currentCompiledProjectKey,
  onConsoleClicked,
  history,
  isHidden,
  isOpen,
  isTextSizeLarge,
  onClearConsoleEntries,
  onInput,
  onToggleVisible,
  onRequestedLineFocused,
  requestedFocusedLine,
}) {
  const console = (
    <div
      className={classnames(
        'console__scroll-container',
        'output__item',
        {u__hidden: isHidden},
      )}
      onClick={onConsoleClicked}
    >
      <div
        className={
          classnames('console__repl', {console__repl_zoomed: isTextSizeLarge})
        }
      >
        <ConsoleInput
          isTextSizeLarge={isTextSizeLarge}
          requestedFocusedLine={requestedFocusedLine}
          onInput={onInput}
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

  const chevron = isOpen ? ' \uf078' : ' \uf077';

  return (
    <div className="console">
      <div
        className="label console__label"
        onClick={partial(onToggleVisible, currentProjectKey)}
      >
        <div>
          Console
          <span className="u__icon">{chevron}</span>
        </div>
        <div
          className="console__button console__button_clear u__icon"
          onClick={(e) => {
            e.stopPropagation();
            onClearConsoleEntries();
          }}
        >
          &#xf05e;
        </div>
      </div>
      {isOpen ? console : null}
    </div>
  );
}

Console.propTypes = {
  currentCompiledProjectKey: PropTypes.number,
  currentProjectKey: PropTypes.string.isRequired,
  history: ImmutablePropTypes.iterable.isRequired,
  isHidden: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isTextSizeLarge: PropTypes.bool,
  requestedFocusedLine: PropTypes.object,
  onClearConsoleEntries: PropTypes.func.isRequired,
  onConsoleClicked: PropTypes.func.isRequired,
  onInput: PropTypes.func.isRequired,
  onRequestedLineFocused: PropTypes.func.isRequired,
  onToggleVisible: PropTypes.func.isRequired,
};

Console.defaultProps = {
  currentCompiledProjectKey: null,
  requestedFocusedLine: null,
  isTextSizeLarge: false,
};
