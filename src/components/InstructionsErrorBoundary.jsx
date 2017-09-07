import React from 'react';
import PropTypes from 'prop-types';
import markdown from '../util/markdown';

export default class InstructionsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {useHighlighting: true};
  }

  /*
   * Highlight.js throws an exception when fed a language it doesn't have
   * configured. None of the React wrappers we're using catch that error,
   * and since it gets run in the child React components created from markdown
   * code sections, these exceptions occur outside the current callstack.
   * `unstable_handleError` is a kludge for catching exceptions raised in child
   * renders introduced in React 15 and to be replaced by `componentDidCatch`
   * in React 16.
   * <InstructionsErrorBoundary> exists because `unstable_handleError` only
   * wraps the *initial* mounting of a child -- we need an "error boundary"
   * component that comes into being in the same mounting phase that
   * Highlight.js gets run.
   * In theory this component can be removed and replaced with a
   * `componentDidCatch` method on the parent when we upgrade to React 16.
   */
  unstable_handleError() { // eslint-disable-line camelcase
    // eslint-disable-next-line react/no-set-state
    this.setState({useHighlighting: false});
  }

  render() {
    return markdown.toReact(
      this.props.instructions,
      this.state.useHighlighting,
    );
  }
}

InstructionsErrorBoundary.propTypes = {
  instructions: PropTypes.string.isRequired,
};
