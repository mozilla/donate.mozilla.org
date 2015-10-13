import React from 'react';

var NavigationMenu = React.createClass({
  render: function () {
    return (
      <ol className="progress">
        {this.props.children}
      </ol>
    );
  }
});

module.exports = NavigationMenu;
