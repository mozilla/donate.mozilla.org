var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Linker = React.createClass({
  render: function() {
    // Swap out Link or a simple anchor depending on the props we have.
    if (this.props.to) {
      return (
        <Link to={this.props.to}>
          {this.props.children}
        </Link>
      )
    }
    return (
      <a href={this.props.href}>
        {this.props.children}
      </a>
    )
  }
});

module.exports = Linker;
