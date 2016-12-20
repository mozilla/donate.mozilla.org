import React from 'react';

module.exports = React.createClass({

  render: function() {
    return (
      <div className="full" id="section-heading">
        {this.props.children}
      </div>
    );
  }

});
