var React = require('react');
var ErrorSublist = require('./ErrorSublist');

var ErrorList = React.createClass({
  propTypes: {
    html: React.PropTypes.array,
    css: React.PropTypes.array,
    javascript: React.PropTypes.array,
    onErrorClicked: React.PropTypes.func,
  },

  render: function() {
    return (
      <div className="errorList">
        <ErrorSublist
          language="html"
          errors={this.props.html}
          onErrorClicked={this.props.onErrorClicked}
        />
        <ErrorSublist
          language="css"
          errors={this.props.css}
          onErrorClicked={this.props.onErrorClicked}
        />
        <ErrorSublist
          language="javascript"
          errors={this.props.javascript}
          onErrorClicked={this.props.onErrorClicked}
        />
      </div>
    );
  },
});

module.exports = ErrorList;
