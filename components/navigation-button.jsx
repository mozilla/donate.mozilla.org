import React from 'react';
import {FormattedNumber} from 'react-intl';
import dispatcher from '../scripts/dispatcher.js';
import listener from '../scripts/listener.js';

var NavigationButton = React.createClass({
  propTypes: {
    activePage: React.PropTypes.number.isRequired,
    index: React.PropTypes.number.isRequired
  },
  onClick: function(e) {
    if (this.props.activePage > this.props.index) {
      dispatcher.fire("toPage", {
        page: this.props.index
      });
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
      </li>
    );
  }
});

var AmountNavigationButton = React.createClass({
  propTypes: {
    activePage: React.PropTypes.number.isRequired,
    index: React.PropTypes.number.isRequired,
    currency: React.PropTypes.string
  },
  getInitialState: function() {
    return {
      amount: ""
    };
  },
  componentDidMount: function() {
    listener.on("fieldUpdated", this.onFieldUpdated);
  },
  componentWillUnmount: function() {
    listener.off("fieldUpdated", this.onFieldUpdated);
  },
  onFieldUpdated: function(e) {
    var detail = e.detail;
    if (detail.field === "amount") {
      this.setState({
        amount: detail.value
      });
    }
  },
  render: function() {
    return (
      <NavigationButton activePage={this.props.activePage} index={this.props.index}>
        {this.props.children}
        <div className="page-breadcrumb">
          { this.state.amount ?
          <FormattedNumber
            maximumFractionDigits={2}
            value={this.state.amount}
            style="currency"
            currency={this.props.currency || "usd"}
          /> : ""}
        </div>
      </NavigationButton>
    );
  }
});

var DisplayNavigationButton = React.createClass({
  propTypes: {
    activePage: React.PropTypes.number.isRequired,
    index: React.PropTypes.number.isRequired,
    display: React.PropTypes.string
  },
  render: function() {
    return (
      <NavigationButton activePage={this.props.activePage} index={this.props.index}>
        {this.props.children}
        <div className="page-breadcrumb">
          {this.props.display}
        </div>
      </NavigationButton>
    );
  }
});

module.exports = {
  NavigationButton: NavigationButton,
  AmountNavigationButton: AmountNavigationButton,
  DisplayNavigationButton: DisplayNavigationButton
};
