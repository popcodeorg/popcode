import React from 'react';
import PropTypes from 'prop-types';
import prefixAll from 'inline-style-prefixer/static';
import {t} from 'i18next';
import {DraggableCore} from 'react-draggable';
import bindAll from 'lodash-es/bindAll';
import isEmpty from 'lodash-es/isEmpty';
import includes from 'lodash-es/includes';
import partial from 'lodash-es/partial';
import partition from 'lodash-es/partition';

import {getNodeHeights} from '../util/resize';

import EditorContainer from './EditorContainer';
import Editor from './Editor';

export default class EditorsColumn extends React.Component {
  constructor(props) {
    super(props);
    this.dividerRefs = [null, null];
    this.editorRefs = [null, null, null];
    bindAll(
      this,
      '_storeDividerRef',
      '_storeEditorRef',
      '_handleEditorDividerDrag',
    );
  }

  _storeEditorRef(index, editor) {
    this.editorRefs[index] = editor;
  }

  _storeDividerRef(index, divider) {
    this.dividerRefs[index] = divider;
  }

  _handleEditorDividerDrag(index, _, {deltaY, lastY, y}) {
    this.props.onDividerDrag({
      index,
      dividerHeights: getNodeHeights(this.dividerRefs),
      editorHeights: getNodeHeights(this.editorRefs),
      deltaY,
      lastY,
      y,
    });
  }

  render() {
    const {
      currentProject,
      editorsFlex,
      errors,
      isTextSizeLarge,
      requestedFocusedLine,
      onComponentHide,
      onEditorInput,
      onRef,
      onRequestedLineFocused,
      style,
    } = this.props;

    const children = [];
    const [hiddenLanguages, visibleLanguages] = partition(
      ['html', 'css', 'javascript'],
      language => includes(
        currentProject.hiddenUIComponents,
        `editor.${language}`,
      ),
    );
    visibleLanguages.forEach((language, index) => {
      children.push(
        <EditorContainer
          key={language}
          language={language}
          source={currentProject.sources[language]}
          style={{flex: editorsFlex[index]}}
          onHide={partial(
            onComponentHide,
            currentProject.projectKey,
            `editor.${language}`,
          )}
          onRef={partial(this._storeEditorRef, index)}
        >
          <Editor
            errors={errors[language].items}
            language={language}
            percentageOfHeight={1 / visibleLanguages.length}
            projectKey={currentProject.projectKey}
            requestedFocusedLine={requestedFocusedLine}
            source={currentProject.sources[language]}
            textSizeIsLarge={isTextSizeLarge}
            onInput={partial(
              onEditorInput,
              currentProject.projectKey,
              language,
            )}
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
        <div className="environment__column-contents editors">{children}</div>
      </div>
    );
  }
}

EditorsColumn.propTypes = {
  currentProject: PropTypes.object.isRequired,
  editorsFlex: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired,
  isTextSizeLarge: PropTypes.bool.isRequired,
  requestedFocusedLine: PropTypes.object,
  style: PropTypes.object.isRequired,
  onComponentHide: PropTypes.func.isRequired,
  onComponentUnhide: PropTypes.func.isRequired,
  onDividerDrag: PropTypes.func.isRequired,
  onEditorInput: PropTypes.func.isRequired,
  onRef: PropTypes.func.isRequired,
  onRequestedLineFocused: PropTypes.func.isRequired,
};

EditorsColumn.defaultProps = {
  requestedFocusedLine: null,
};
