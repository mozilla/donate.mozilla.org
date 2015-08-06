import React from 'react';

module.exports = React.createClass({

  render: function() {
    return (
      <div className="full"><h2>{this.props.children}</h2></div>
    );
  }

});
