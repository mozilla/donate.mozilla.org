import React from 'react';

var NavigationContainer = React.createClass({
  componentDidMount: function() {
    window.addEventListener("resize", this.onResize);
  },
  render: function() {
    return (
      <div style={{height: this.props.height}} className="sequence-page-container">
        {this.props.children}
      </div>
    )
  }
});

module.exports = NavigationContainer;
