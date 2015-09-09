"use strict";

var React = require('react/addons');
var update = React.addons.update;
var _ = require('lodash');

var Editor = require('./Editor.jsx');
var Output = require('./Output.jsx');
var Toolbar = require('./Toolbar.jsx');
var Validations = require('../validations');
var Storage = require('../services/Storage');
var config = require('../config');

var Workspace = React.createClass({
  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {
    Storage.load().then(function(payload) {
      if (payload === undefined) {
        this.setState(this._cleanProjectState());
      } else {
        this.setState(_.assign({}, this._cleanProjectState(), {
          projectKey: payload.key,
          sources: payload.data.sources,
          enabledLibraries: payload.data.enabledLibraries
        }));
      }
    }.bind(this));
  },

  componentWillUpdate: function(_nextProps, nextState) {
    var anyChanged = false;

    if (this.state.projectKey === undefined) {
      return;
    }

    for (var language in nextState.sources) {
      if (this.state.sources[language] !== nextState.sources[language]) {
        this._validateInput(
          language,
          nextState.sources[language],
          nextState.enabledLibraries);

        anyChanged = true;
      }
    }

    if (anyChanged ||
        this.state.enabledLibraries < nextState.enabledLibraries ||
        this.state.enabledLibraries > nextState.enabledLibraries) {

      Storage.save(
        nextState.projectKey,
        {
          sources: nextState.sources,
          enabledLibraries: nextState.enabledLibraries
        }
      );
    }
  },

  render: function() {
    var environment;
    if (this.state.projectKey !== undefined) {
      environment = (
        <div className="environment">
          <Output
            projectKey={this.state.projectKey}
            sources={this.state.sources}
            errors={this.state.errors}
            enabledLibraries={this.state.enabledLibraries}
            onErrorClicked={this._onErrorClicked} />

          <Editor
            ref="htmlEditor"
            projectKey={this.state.projectKey}
            language="html"
            source={this.state.sources.html}
            errors={this.state.errors.html}
            onChange={this._setSource} />

          <Editor
            ref="cssEditor"
            projectKey={this.state.projectKey}
            language="css"
            source={this.state.sources.css}
            errors={this.state.errors.css}
            onChange={this._setSource} />

          <Editor
            ref="javascriptEditor"
            projectKey={this.state.projectKey}
            language="javascript"
            source={this.state.sources.javascript}
            errors={this.state.errors.javascript}
            onChange={this._setSource} />
        </div>
      );
    }

    return (
      <div id="workspace">
        <Toolbar
          enabledLibraries={this.state.enabledLibraries}
          onNewProject={this._onNewProject}
          onProjectSelected={this._onProjectSelected}
          onLibraryToggled={this._onLibraryToggled} />
        {environment}
      </div>
    )
  },

  _cleanProjectState: function() {
    return _.assign(config.defaults, {
      projectKey: this._generateProjectKey()
    });
  },

  _setSource: function(language, source) {
    var updateCommand = {sources: {}};
    updateCommand.sources[language] = {$set: source};

    this.setState(function(oldState) {
      return update(oldState, updateCommand);
    });
  },

  _validateInput: function(language, source, enabledLibraries) {
    var validate = Validations[language];
    validate(source, enabledLibraries).then(function(errors) {
      var updateCommand = {errors: {}};
      updateCommand.errors[language] = {$set: errors};
      this.setState(function(oldState) {
        return update(oldState, updateCommand);
      });
    }.bind(this));
  },

  _onErrorClicked: function(language, line, column) {
    var editor = this.refs[language + 'Editor'];
    editor._jumpToLine(line, column);
  },

  _generateProjectKey: function() {
    //FIXME handle in Store
    var date = new Date();
    return (date.getTime() * 1000 + date.getMilliseconds()).toString();
  },

  _onNewProject: function() {
    this.setState(this._cleanProjectState());
  },

  _onProjectSelected: function(project) {
    this.setState(function(oldState) {
      return _.assign({}, this._cleanProjectState(), project.data, {
        projectKey: project.key
      })
    });
  },

  _onLibraryToggled: function(libraryKey) {
    this.setState(function(oldState) {
      var libraryIndex = oldState.enabledLibraries.indexOf(libraryKey);
      if (libraryIndex !== -1) {
        return update(oldState, {
          enabledLibraries: {$splice: [[libraryIndex, 1]]}
        });
      } else {
        return update(oldState, {enabledLibraries: {$push: [libraryKey]}});
      }
    });
  }
});

module.exports = Workspace;
