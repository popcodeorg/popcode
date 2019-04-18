import {DraggableCore} from 'react-draggable';
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import classnames from 'classnames';
import isEmpty from 'lodash-es/isEmpty';
import partial from 'lodash-es/partial';

import {EditorLocation} from '../records';

import EditorContainer from './EditorContainer';
import Editor from './Editor';

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
  onRequestedLineFocused,
  onResizableFlexDividerDrag,
  visibleLanguages,
}) {
  const editors = [];

  visibleLanguages.forEach(({language, index}) => {
    editors.push(
      <EditorContainer
        key={language}
        language={language}
        ref={resizableFlexRefs[index]}
        source={currentProject.sources[language]}
        style={{flexGrow: resizableFlexGrow.get(index)}}
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
          onInput={partial(onEditorInput, currentProject.projectKey, language)}
          onRequestedLineFocused={onRequestedLineFocused}
        />
      </EditorContainer>,
    );
    if (index < visibleLanguages.length - 1) {
      editors.push(
        <DraggableCore
          key={`divider:${language}`}
          onDrag={partial(onResizableFlexDividerDrag, index)}
        >
          <div
            className={classnames('editors__row-divider', {
              'editors__row-divider_draggable': isFlexResizingSupported,
            })}
          />
        </DraggableCore>,
      );
    }
  });

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
  onRequestedLineFocused: PropTypes.func.isRequired,
  onResizableFlexDividerDrag: PropTypes.func.isRequired,
};

EditorsColumn.defaultProps = {
  requestedFocusedLine: null,
};
