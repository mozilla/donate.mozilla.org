import React from 'react';

var NavigationContainer = React.createClass({
  propTypes: {
    children: React.PropTypes.any
  },
  componentDidMount: function() {
    window.addEventListener("resize", this.onResize);
  },
  render: function() {
    return (
      <div className="sequence-page-container">
        {this.props.children}
      </div>
    );
  }
});

module.exports = NavigationContainer;
