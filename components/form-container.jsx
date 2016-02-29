import React from 'react';

var FormContainer = React.createClass({
  propTypes: {
    children: React.PropTypes.any
  },
  render: function() {
    return (
      <form id="donation-form" method="post">
        <div className="container">
          {this.props.children}
        </div>
      </form>
    );
  }
});

module.exports = FormContainer;
