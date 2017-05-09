import React from 'react';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';
import partial from 'lodash/partial';

import EditorContainer from './EditorContainer';
import Editor from './Editor';

function allErrorsFor(language, errors, runtimeErrors) {
  if (language === 'javascript') {
    return errors.javascript.items.concat(runtimeErrors);
  }
  return errors[language].items;
}

export default function EditorsColumn({
  currentProject,
  errors,
  onComponentHide,
  onEditorInput,
  onRequestedLineFocused,
  runtimeErrors,
  ui,
}) {
  const editors = [];
  ['html', 'css', 'javascript'].forEach((language) => {
    if (includes(currentProject.hiddenUIComponents, `editor.${language}`)) {
      return;
    }

    editors.push(
      <EditorContainer
        key={language}
        language={language}
        source={currentProject.sources[language]}
        onHide={
          partial(onComponentHide, `editor.${language}`)
        }
      >
        <Editor
          errors={allErrorsFor(language, errors, runtimeErrors)}
          key={language}
          language={language}
          percentageOfHeight={1 / editors.length}
          projectKey={currentProject.projectKey}
          requestedFocusedLine={ui.editors.requestedFocusedLine}
          source={currentProject.sources[language]}
          onInput={partial(onEditorInput, language)}
          onRequestedLineFocused={onRequestedLineFocused}
        />
      </EditorContainer>,
    );
  });

  if (isEmpty(editors)) {
    return null;
  }

  return (
    <div className="environment__column">
      <div className="environment__columnContents editors">{editors}</div>
    </div>
  );
}

EditorsColumn.propTypes = {
  currentProject: React.PropTypes.object.isRequired,
  errors: React.PropTypes.object.isRequired,
  runtimeErrors: React.PropTypes.array.isRequired,
  ui: React.PropTypes.shape({
    editors: React.PropTypes.object.isRequired,
  }).isRequired,
  onComponentHide: React.PropTypes.func.isRequired,
  onEditorInput: React.PropTypes.func.isRequired,
  onRequestedLineFocused: React.PropTypes.func.isRequired,
};
