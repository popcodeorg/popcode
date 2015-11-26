var React = require('react');

var CurrentProjectStore = require('../stores/CurrentProjectStore');
var Editor = require('./Editor');
var Output = require('./Output');
var Toolbar = require('./Toolbar');

function calculateState() {
  return {projectKey: CurrentProjectStore.getKey()};
}

var Workspace = React.createClass({
  getInitialState: function() {
    return calculateState();
  },

  componentDidMount: function() {
    CurrentProjectStore.addChangeListener(this._onChange);
  },

  componentDidUnmount: function() {
    CurrentProjectStore.removeChangeListener(this._onChange);
  },

  _onErrorClicked: function(language, line, column) {
    var editor = this.refs[language + 'Editor'];
    editor._jumpToLine(line, column);
  },

  _onChange: function() {
    this.setState(calculateState());
  },

  render: function() {
    var environment;
    if (this.state.projectKey !== undefined) {
      environment = (
        <div className="environment">
          <Output
            enabledLibraries={this.state.enabledLibraries}
            onErrorClicked={this._onErrorClicked}
          />

          <Editor
            ref="htmlEditor"
            projectKey={this.state.projectKey}
            language="html"
          />

          <Editor
            ref="cssEditor"
            projectKey={this.state.projectKey}
            language="css"
          />

          <Editor
            ref="javascriptEditor"
            projectKey={this.state.projectKey}
            language="javascript"
          />
        </div>
      );
    }

    return (
      <div id="workspace">
        <Toolbar />
        {environment}
      </div>
    );
  },
});

module.exports = Workspace;
