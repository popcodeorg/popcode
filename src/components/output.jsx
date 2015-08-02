var React = require('react');
var Preview = require('./preview.jsx');

var Output = React.createClass({
  render: function() {
    return (
      <Preview html={this.props.html.source}
        css={this.props.css.source}
        javascript={this.props.javascript.source} />
    )
  }
});

module.exports = Output;
