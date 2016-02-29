import React from 'react';

var SectionHeader = React.createClass({

  render: function() {
    return (
      <div className="full">
        {this.props.children}
      </div>
    );
  }

});

module.exports = SectionHeader;
