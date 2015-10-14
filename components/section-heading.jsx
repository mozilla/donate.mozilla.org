import React from 'react';

module.exports = React.createClass({

  render: function() {
    return (
      <div className="row">
        <div className="full">
          {this.props.children}
        </div>
      </div>
    );
  }

});
