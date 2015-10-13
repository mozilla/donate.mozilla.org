import React from 'react';
import {FormattedNumber} from 'react-intl';

var NavigationButton = React.createClass({
  onClick: function(e) {
    if (this.props.activePage > this.props.index) {
      this.props.onClick(this.props.index);
    }
  },
  render: function() {
    var className = "";
    var activePage = this.props.activePage;
    var index = this.props.index;
    if (activePage < index) {
      className += "incomplete";
    } else if (activePage > index) {
      className += "complete";
    } else {
      className += "active";
    }
    return (
      <li onClick={this.onClick} className={className}>
        {this.props.children}
        <div className="page-breadcrumb">
          { this.props.amount ?
          <FormattedNumber
            maximumFractionDigits={2}
            value={this.props.amount}
            style="currency"
            currency={this.props.currency || "usd"}
          /> : this.props.display}
        </div>
      </li>
    );
  }
});

module.exports = NavigationButton;
