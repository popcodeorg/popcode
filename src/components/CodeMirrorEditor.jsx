import CodeMirror from 'codemirror';
import LRU from 'lru-cache';
import PropTypes from 'prop-types';
import React, {useEffect, useLayoutEffect, useRef} from 'react';

import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/css/css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/selection/active-line';

const CODEMIRROR_MODES_MAP = {
  html: 'htmlmixed',
  css: 'css',
  javascript: 'javascript',
};

export default function CodeMirrorEditor({
  language,
  projectKey,
  source,
  onInput,
}) {
  const containerRef = useRef();
  const editorRef = useRef();
  const docsCacheRef = useRef(new LRU(3));

  useLayoutEffect(() => {
    const container = containerRef.current;

    const editor = (editorRef.current = CodeMirror(container, {
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

  return <div className="editors__codemirror-container" ref={containerRef} />;
}

CodeMirrorEditor.propTypes = {
  language: PropTypes.string.isRequired,
  projectKey: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  onInput: PropTypes.func.isRequired,
};
