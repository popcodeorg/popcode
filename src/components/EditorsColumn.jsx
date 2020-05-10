import classnames from 'classnames';
import isEmpty from 'lodash-es/isEmpty';
import memoize from 'lodash-es/memoize';
import partial from 'lodash-es/partial';
import PropTypes from 'prop-types';
import React, {useCallback} from 'react';
import {DraggableCore} from 'react-draggable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import {EditorLocation} from '../records';

import Editor from './Editor';
import EditorContainer from './EditorContainer';

export default function EditorsColumn({
  currentProject,
  errors,
  resizableFlexGrow,
  resizableFlexRefs,
  isFlexResizingSupported,
  isTextSizeLarge,
  requestedFocusedLine,
  onAutoFormat,
  onComponentHide,
  onEditorInput,
  onEditorReady,
  onRequestedLineFocused,
  onResizableFlexDividerDrag,
  onSave,
  visibleLanguages,
}) {
  const handleInputForLanguage = useCallback(
    memoize(language =>
      partial(onEditorInput, currentProject.projectKey, language),
    ),
    [onEditorInput, currentProject.projectKey],
  );

  const editors = [];

  visibleLanguages.forEach(
    ({language, index: languageIndex}, visibleLanguagesIndex) => {
      editors.push(
        <EditorContainer
          key={language}
          language={language}
          ref={resizableFlexRefs[languageIndex]}
          source={currentProject.sources[language]}
          style={{flexGrow: resizableFlexGrow.get(languageIndex)}}
          onHide={partial(
            onComponentHide,
            currentProject.projectKey,
            `editor.${language}`,
          )}
        >
          <Editor
            errors={errors[language].items}
            language={language}
            percentageOfHeight={1 / visibleLanguages.length}
            projectKey={currentProject.projectKey}
            requestedFocusedLine={requestedFocusedLine}
            source={currentProject.sources[language]}
            textSizeIsLarge={isTextSizeLarge}
            onAutoFormat={onAutoFormat}
            onInput={handleInputForLanguage(language)}
            onReady={partial(onEditorReady, language)}
            onRequestedLineFocused={onRequestedLineFocused}
            onSave={onSave}
          />
        </EditorContainer>,
      );
      if (visibleLanguagesIndex < visibleLanguages.length - 1) {
        editors.push(
          <DraggableCore
            key={`divider:${language}`}
            onDrag={partial(onResizableFlexDividerDrag, languageIndex)}
          >
            <div
              className={classnames('editors__row-divider', {
                'editors__row-divider_draggable': isFlexResizingSupported,
              })}
            />
          </DraggableCore>,
        );
      }
    },
  );

  if (isEmpty(editors)) {
    return null;
  }

  return <div className="editors">{editors}</div>;
}

EditorsColumn.propTypes = {
  currentProject: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  isFlexResizingSupported: PropTypes.bool.isRequired,
  isTextSizeLarge: PropTypes.bool.isRequired,
  requestedFocusedLine: PropTypes.instanceOf(EditorLocation),
  resizableFlexGrow: ImmutablePropTypes.list.isRequired,
  resizableFlexRefs: PropTypes.array.isRequired,
  visibleLanguages: PropTypes.array.isRequired,
  onAutoFormat: PropTypes.func.isRequired,
  onComponentHide: PropTypes.func.isRequired,
  onEditorInput: PropTypes.func.isRequired,
  onEditorReady: PropTypes.func.isRequired,
  onRequestedLineFocused: PropTypes.func.isRequired,
  onResizableFlexDividerDrag: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

EditorsColumn.defaultProps = {
  requestedFocusedLine: null,
};
