import React from 'react';
import analytics from '../assets/js/analytics.js';
import form from '../scripts/form.js';

var ThankYou = React.createClass({
  propTypes: {
    test: React.PropTypes.string,
    email: React.PropTypes.string,
    className: React.PropTypes.string,
    children: React.PropTypes.array
  },
  componentDidMount: function() {
    form.updateField("email", this.props.email || "");
    analytics();
  },
  render: function() {
    var className = "row thank-you-page";
    if (this.props.className) {
      className += " " + this.props.className;
    }
    if (this.props.test) {
      className += " " + this.props.test;
    }
    return (
      <div>
        <div className={className}>
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = ThankYou;
