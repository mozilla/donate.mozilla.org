import React from 'react';
import form from '../scripts/form.js';

var NavigationPage = React.createClass({
  componentDidMount: function() {
    if (this.props.errors) {
      form.pageErrors(this.props.errors, this.props.index);
    }
  },
  render: function() {
    var className = "sequence-page";
    var activePage = this.props.activePage;
    var index = this.props.index;
    if (activePage < index) {
      className += " page-hidden-incomplete";
    } else if (activePage > index) {
      className += " page-hidden-complete";
    } else {
      className += " page-active";
    }
    return (
      <fieldset className={className}>
        {this.props.children}
      </fieldset>
    );
  }
});

module.exports = NavigationPage;
