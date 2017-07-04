import React from 'react';
import PropTypes from 'prop-types';
import {DraggableCore} from 'react-draggable';
import bindAll from 'lodash/bindAll';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';
import partial from 'lodash/partial';
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
      onComponentHide,
      onEditorInput,
      onRef,
      onRequestedLineFocused,
      style,
      ui,
    } = this.props;

    const children = [];
    const languages = ['html', 'css', 'javascript'].filter(language =>
      !includes(currentProject.hiddenUIComponents, `editor.${language}`),
    );
    languages.forEach((language, index) => {
      children.push(
        <EditorContainer
          key={language}
          language={language}
          source={currentProject.sources[language]}
          style={{flex: editorsFlex[index]}}
          onHide={partial(onComponentHide, `editor.${language}`)}
          onRef={partial(this._storeEditorRef, index)}
        >
          <Editor
            errors={errors[language].items}
            key={language}
            language={language}
            percentageOfHeight={1 / languages.length}
            projectKey={currentProject.projectKey}
            requestedFocusedLine={ui.editors.requestedFocusedLine}
            source={currentProject.sources[language]}
            onInput={partial(onEditorInput, language)}
            onRequestedLineFocused={onRequestedLineFocused}
          />
        </EditorContainer>,
      );
      if (index < languages.length - 1) {
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

    if (isEmpty(children)) {
      return null;
    }

    return (
      <div className="environment__column" ref={onRef} style={style}>
        <div className="environment__columnContents editors">{children}</div>
      </div>
    );
  }
}

EditorsColumn.propTypes = {
  currentProject: PropTypes.object.isRequired,
  editorsFlex: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  ui: PropTypes.shape({
    editors: PropTypes.object.isRequired,
  }).isRequired,
  onComponentHide: PropTypes.func.isRequired,
  onDividerDrag: PropTypes.func.isRequired,
  onEditorInput: PropTypes.func.isRequired,
  onRef: PropTypes.func.isRequired,
  onRequestedLineFocused: PropTypes.func.isRequired,
};
