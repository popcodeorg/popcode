import React from 'react';
import PropTypes from 'prop-types';
import prefixAll from 'inline-style-prefixer/static';
import {t} from 'i18next';
import {DraggableCore} from 'react-draggable';
import bindAll from 'lodash/bindAll';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';
import partial from 'lodash/partial';
import partition from 'lodash/partition';
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
      environmentColumnFlex,
      errors,
      requestedFocusedLine,
      textSizeIsLarge,
      onComponentHide,
      onEditorInput,
      onRef,
      onRequestedLineFocused,
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
          style={prefixAll({flex: editorsFlex[index]})}
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
            textSizeIsLarge={textSizeIsLarge}
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
        style={prefixAll({flex: environmentColumnFlex[0]})}
      >
        <div className="environment__column-contents editors">{children}</div>
      </div>
    );
  }
}

EditorsColumn.propTypes = {
  currentProject: PropTypes.object.isRequired,
  editorsFlex: PropTypes.array.isRequired,
  environmentColumnFlex: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired,
  requestedFocusedLine: PropTypes.object,
  textSizeIsLarge: PropTypes.bool.isRequired,
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
