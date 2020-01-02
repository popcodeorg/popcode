import CodeMirror from 'codemirror';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import get from 'lodash-es/get';
import isNil from 'lodash-es/isNil';
import preventClickthrough from 'react-prevent-clickthrough';
import React, {useEffect, useLayoutEffect, useRef} from 'react';
import PropTypes from 'prop-types';

import {EditorLocation} from '../records';

import 'codemirror/mode/javascript/javascript';

export default function CodeMirrorConsoleInput({
  currentInputValue,
  requestedFocusedLine,
  onChange,
  onInput,
  onNextConsoleHistory,
  onPreviousConsoleHistory,
  onRequestedLineFocused,
}) {
  const containerRef = useRef(null);
  const editorRef = useRef(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!isNil(container)) {
      const editor = (editorRef.current = CodeMirror(container, {
        autofocus: true,
        electricChars: false,
        lineNumbers: false,
        mode: 'javascript',
        scrollbarStyle: null,
        smartIndent: false,
        viewportMargin: 0,
      }));
      editor.setSize('100%', '100%');
    }
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor.getValue() !== currentInputValue) {
      editor.setValue(currentInputValue);
    }
  }, [currentInputValue]);

  useEffect(() => {
    const editor = editorRef.current;
    const extraKeys = editor.getOption('extraKeys');
    editor.setOption('extraKeys', {
      ...extraKeys,

      Down: onNextConsoleHistory,

      Enter() {
        onInput(editor.getValue());
      },

      Up: onPreviousConsoleHistory,
    });
    return () => {
      editor.setOption('extraKeys', extraKeys);
    };
  }, [onInput, onNextConsoleHistory, onPreviousConsoleHistory]);

  useEffect(() => {
    const editor = editorRef.current;
    function handleChanges(_, [{origin}]) {
      if (origin !== 'setValue') {
        onChange(editor.getValue());
      }
    }
    editor.on('changes', handleChanges);
    return () => {
      editor.off('changes', handleChanges);
    };
  }, [onChange]);

  useEffect(() => {
    if (get(requestedFocusedLine, ['component']) === 'console') {
      const editor = editorRef.current;
      editor.focus();
      onRequestedLineFocused();
    }
  }, [onRequestedLineFocused, requestedFocusedLine]);

  return (
    <div className="console__row console__input" onClick={preventClickthrough}>
      <div className="console__chevron console__chevron_blue">
        <FontAwesomeIcon icon={faChevronRight} />
      </div>
      <div className="console__editor" ref={containerRef} />
    </div>
  );
}

CodeMirrorConsoleInput.propTypes = {
  currentInputValue: PropTypes.string.isRequired,
  requestedFocusedLine: PropTypes.instanceOf(EditorLocation),
  onChange: PropTypes.func.isRequired,
  onInput: PropTypes.func.isRequired,
  onNextConsoleHistory: PropTypes.func.isRequired,
  onPreviousConsoleHistory: PropTypes.func.isRequired,
  onRequestedLineFocused: PropTypes.func.isRequired,
};

CodeMirrorConsoleInput.defaultProps = {
  isTextSizeLarge: false,
  requestedFocusedLine: null,
};
