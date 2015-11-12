import React from 'react';
import Router from 'react-router';
var Link = Router.Link;

var Linker = React.createClass({
  propTypes: {
    to: React.PropTypes.string,
    href: React.PropTypes.string
  },
  render: function() {
    // Swap out Link or a simple anchor depending on the props we have.
    if (this.props.to) {
      return (
        <Link to={this.props.to}>
          {this.props.children}
        </Link>
      );
    }
    return (
      <a href={this.props.href}>
        {this.props.children}
      </a>
    );
  }
});

module.exports = Linker;
