import React from 'react';

var SectionHeader = React.createClass({
  propTypes: {
    children: React.PropTypes.any
  },
  render: function() {
    return (
      <div className="full">
        {this.props.children}
      </div>
    );
  }

});

module.exports = SectionHeader;
