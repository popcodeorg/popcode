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
  history,
  isEnabled,
  isOpen,
  isTextSizeLarge,
  showingErrors,
  onClearConsoleEntries,
  onInput,
  onToggleVisible,
}) {
  if (showingErrors || !isEnabled) {
    return null;
  }

  const console = (
    <div className="console__scroll-container output__item">
      <div
        className={
          classnames('console__repl', {console__repl_zoomed: isTextSizeLarge})
        }
      >
        <ConsoleInput isTextSizeLarge={isTextSizeLarge} onInput={onInput} />
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
          <span className="console__chevron u__icon">{chevron}</span>
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
  isEnabled: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isTextSizeLarge: PropTypes.bool,
  showingErrors: PropTypes.bool.isRequired,
  onClearConsoleEntries: PropTypes.func.isRequired,
  onInput: PropTypes.func.isRequired,
  onToggleVisible: PropTypes.func.isRequired,
};

Console.defaultProps = {
  currentCompiledProjectKey: null,
  isTextSizeLarge: false,
};
