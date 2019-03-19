import constant from 'lodash-es/constant';
import classnames from 'classnames';
import CodeMirror from 'codemirror';
import LRU from 'lru-cache';
import map from 'lodash-es/map';
import PropTypes from 'prop-types';
import React, {useEffect, useLayoutEffect, useRef} from 'react';

import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/css/css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/selection/active-line';

import bowser from '../services/bowser';

const CODEMIRROR_MODES_MAP = {
  html: 'htmlmixed',
  css: 'css',
  javascript: 'javascript',
};

export default function CodeMirrorEditor({
  errors,
  language,
  projectKey,
  source,
  textSizeIsLarge,
  onAutoFormat,
  onInput,
}) {
  const containerRef = useRef();
  const editorRef = useRef();
  const docsCacheRef = useRef(new LRU(3));

  useLayoutEffect(() => {
    const container = containerRef.current;

    const editor = (editorRef.current = CodeMirror(container, {
      gutters: ['CodeMirror-lint-markers'],
      indentUnit: 4,
      lineNumbers: true,
      lineWrapping: true,
      matchBrackets: true,
      styleActiveLine: true,
    }));
    editor.setSize('100%', '100%');
  }, []);

  useLayoutEffect(() => {
    const mode = CODEMIRROR_MODES_MAP[language];
    const editor = editorRef.current;
    const docsCache = docsCacheRef.current;
    const docKey = `${language}:${projectKey}`;
    if (!docsCache.has(docKey)) {
      docsCache.set(docKey, new CodeMirror.Doc('', mode));
    }
    const doc = docsCache.get(docKey);

    if (doc !== editor.getDoc()) {
      editor.swapDoc(doc);
    }
  }, [language, projectKey]);

  useLayoutEffect(() => {
    const editor = editorRef.current;
    if (editor.getValue() !== source) {
      editor.setValue(source);
    }
  }, [source]);

  useEffect(() => {
    const editor = editorRef.current;

    function handleChanges(_, [{origin}]) {
      if (origin !== 'setValue') {
        onInput(editor.getValue());
      }
    }
    editor.on('changes', handleChanges);
    return () => {
      editor.off('changes', handleChanges);
    };
  }, [onInput]);

  useEffect(() => {
    const editor = editorRef.current;
    editor.setOption('lint', {
      getAnnotations: constant(
        map(errors, ({text, row}) => ({
          message: text,
          severity: 'error',
          from: {line: row, ch: 0},
          to: {line: row, ch: 0},
        })),
      ),
      lintOnChange: false,
    });
    editor.performLint();
  }, [errors]);

  useEffect(() => {
    const editor = editorRef.current;
    const keyBinding = bowser.isOS('macOS') ? 'Cmd-I' : 'Ctrl-I';
    editor.setOption('extraKeys', {[keyBinding]: onAutoFormat});
  }, [onAutoFormat]);

  return (
    <div
      className={classnames('editors__codemirror-container', {
        'editors__codemirror-container_large-text': textSizeIsLarge,
      })}
      ref={containerRef}
    />
  );
}

CodeMirrorEditor.propTypes = {
  errors: PropTypes.array.isRequired,
  language: PropTypes.string.isRequired,
  projectKey: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  textSizeIsLarge: PropTypes.bool,
  onAutoFormat: PropTypes.func.isRequired,
  onInput: PropTypes.func.isRequired,
};

CodeMirrorEditor.defaultProps = {
  textSizeIsLarge: false,
};
