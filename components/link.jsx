var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Linker = React.createClass({
  render: function() {
    return (
      <Link to={this.props.to}>{this.props.children}</Link>
    );
  }
});

module.exports = Linker;
