import React from 'react';

module.exports = React.createClass({
  render: function() {
    return (
      <div className="monthly-popup-cover">
        <div className="monthly-popup-container">
          <div className="highlight">{this.props.highlight}</div>
          <div className="highlight">{this.props.children}</div>
          <button></button>
          <button></button>
        </div>
      </div>
    );
  }
});
