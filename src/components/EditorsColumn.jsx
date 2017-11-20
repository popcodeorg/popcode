import {DraggableCore} from 'react-draggable';
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import prefixAll from 'inline-style-prefixer/static';
import {t} from 'i18next';
import isEmpty from 'lodash-es/isEmpty';
import includes from 'lodash-es/includes';
import map from 'lodash-es/map';
import partial from 'lodash-es/partial';
import partition from 'lodash-es/partition';

import {EditorLocation} from '../records';

import EditorContainer from './EditorContainer';
import Editor from './Editor';

export default function EditorsColumn({
  currentProject,
  errors,
  resizableFlexGrow,
  resizableFlexRefs,
  isTextSizeLarge,
  requestedFocusedLine,
  onComponentHide,
  onComponentUnhide,
  onEditorCursorChange,
  onEditorInput,
  onRef,
  onRequestedLineFocused,
  onResizableFlexDividerDrag,
  style,
}) {
  const [hiddenLanguages, visibleLanguages] = partition(
    map(
      ['html', 'css', 'javascript'],
      (language, index) => ({language, index}),
    ),
    ({language}) => includes(
      currentProject.hiddenUIComponents,
      `editor.${language}`,
    ),
  );

<<<<<<< HEAD
  const children = [];
=======
  render() {
    const {
      currentProject,
      editorsFlex,
      errors,
      onComponentHide,
      onEditorBlurred,
      onEditorCursorChange,
      onEditorFocused,
      onEditorInput,
      onRef,
      onRequestedLineFocused,
      style,
      ui,
    } = this.props;
>>>>>>> 23eb7f2... Updates to element highlighter

  visibleLanguages.forEach(({language, index}) => {
    children.push(
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
<<<<<<< HEAD
          textSizeIsLarge={isTextSizeLarge}
          onCursorChange={onEditorCursorChange}
          onInput={partial(
            onEditorInput,
            currentProject.projectKey,
            language,
=======
          style={{flex: editorsFlex[index]}}
          onHide={partial(onComponentHide, `editor.${language}`)}
          onRef={partial(this._storeEditorRef, index)}
        >
          <Editor
            errors={errors[language].items}
            language={language}
            percentageOfHeight={1 / visibleLanguages.length}
            projectKey={currentProject.projectKey}
            requestedFocusedLine={ui.editors.requestedFocusedLine}
            source={currentProject.sources[language]}
            textSizeIsLarge={ui.editors.textSizeIsLarge}
            onCursorChange={onEditorCursorChange}
            onEditorBlurred={onEditorBlurred}
            onEditorFocused={onEditorFocused}
            onInput={partial(onEditorInput, language)}
            onRequestedLineFocused={onRequestedLineFocused}
          />
        </EditorContainer>,
      );
      if (index < visibleLanguages.length - 1) {
        children.push(
          <DraggableCore
            key={`divider:${language}`}
            onDrag={partial(this._handleEditorDividerDrag, index)}
          >
            <div
              className="editors__row-divider"
              ref={partial(this._storeDividerRef, index)}
            />
          </DraggableCore>,
        );
      }
    });

    hiddenLanguages.forEach((language) => {
      children.push((
        <div
          className="editors__collapsed-editor"
          key={language}
          onClick={partial(
            this.props.onComponentUnhide,
            `editor.${language}`,
>>>>>>> 23eb7f2... Updates to element highlighter
          )}
          onRequestedLineFocused={onRequestedLineFocused}
        />
      </EditorContainer>,
    );
    if (index < visibleLanguages.length - 1) {
      children.push(
        <DraggableCore
          key={`divider:${language}`}
          onDrag={partial(onResizableFlexDividerDrag, index)}
        >
          <div className="editors__row-divider" />
        </DraggableCore>,
      );
    }
  });

  hiddenLanguages.forEach(({language}) => {
    children.push((
      <div
        className="editors__collapsed-editor"
        key={language}
        onClick={partial(
          onComponentUnhide,
          currentProject.projectKey,
          `editor.${language}`,
        )}
      >
        <div className="label editors__label editors__label_collapsed">
          {t(`languages.${language}`)}
          {' '}
          <span className="u__icon">&#xf077;</span>
        </div>
      </div>
    ));
  });

  if (isEmpty(children)) {
    return null;
  }

  return (
    <div
      className="environment__column"
      ref={onRef}
      style={prefixAll(style)}
    >
      <div className="environment__column-contents editors">
        {children}
      </div>
    </div>
  );
}

EditorsColumn.propTypes = {
  currentProject: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  isTextSizeLarge: PropTypes.bool.isRequired,
  requestedFocusedLine: PropTypes.instanceOf(EditorLocation),
  resizableFlexGrow: ImmutablePropTypes.list.isRequired,
  resizableFlexRefs: PropTypes.array.isRequired,
  style: PropTypes.object.isRequired,
  onComponentHide: PropTypes.func.isRequired,
  onComponentUnhide: PropTypes.func.isRequired,
<<<<<<< HEAD
=======
  onDividerDrag: PropTypes.func.isRequired,
  onEditorBlurred: PropTypes.func.isRequired,
>>>>>>> 23eb7f2... Updates to element highlighter
  onEditorCursorChange: PropTypes.func.isRequired,
  onEditorFocused: PropTypes.func.isRequired,
  onEditorInput: PropTypes.func.isRequired,
  onRef: PropTypes.func.isRequired,
  onRequestedLineFocused: PropTypes.func.isRequired,
  onResizableFlexDividerDrag: PropTypes.func.isRequired,
};

EditorsColumn.defaultProps = {
  requestedFocusedLine: null,
};
