var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Linker = React.createClass({
  render: function() {
    if (typeof (window) !== "undefined") {
      return (
        <Link to={this.props.to}>{this.props.children}</Link>
      )
    }
    return (
      <div>Bamf</div>
    );
  }
});

module.exports = Linker;
