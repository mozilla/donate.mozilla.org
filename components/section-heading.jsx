import React from 'react';

module.exports = React.createClass({

  render: function() {
    return (
      <div className="full">
        <div className="row">
          {this.props.children}
        </div>
      </div>
    );
  }

});
