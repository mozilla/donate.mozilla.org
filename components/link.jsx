import React from 'react';
import {Link} from 'react-router';

var Linker = React.createClass({
  propTypes: {
    to: React.PropTypes.string,
    href: React.PropTypes.string,
    children: React.PropTypes.any
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
