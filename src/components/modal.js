import React from 'react';

var Modal = React.createClass({
  componentDidMount: function() {
    document.querySelector("html").style.overflow = "hidden";
  },
  componentWillUnmount: function() {
    document.querySelector("html").style.overflow = "auto";
  },
  render: function() {
    return (
      <div className="modal-container">
        <div className="modal">
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = Modal;

