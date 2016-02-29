import React from 'react';

var NavigationMenu = React.createClass({
  propTypes: {
    children: React.PropTypes.any
  },
  render: function() {
    return (
      <ol className="progress">
        {this.props.children}
      </ol>
    );
  }
});

module.exports = NavigationMenu;
