import React from 'react';
import {FormattedNumber} from 'react-intl';
import dispatcher from '../scripts/dispatcher.js';
import listener from '../scripts/listener.js';
import form from '../scripts/form.js';

var NavigationButton = React.createClass({
  propTypes: {
    activePage: React.PropTypes.number.isRequired,
    index: React.PropTypes.number.isRequired,
    validate: React.PropTypes.array.isRequired
  },
  onClick: function(e) {
    var valid;
    if ((this.props.activePage+1) >= this.props.index) {
      valid = form.validate(this.props.validate);
      if (valid) {
        dispatcher.fire("toPage", {
          page: this.props.index
        });
      }
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
    index: React.PropTypes.number.isRequired
  },
  getInitialState: function() {
    return {
      amount: "",
      currency: {}
    };
  },
  componentDidMount: function() {
    listener.on("fieldUpdated", this.onFieldUpdated);
    listener.on("stateUpdated", this.onStateUpdated);
  },
  componentWillUnmount: function() {
    listener.off("fieldUpdated", this.onFieldUpdated);
    listener.off("stateUpdated", this.onStateUpdated);
  },
  onFieldUpdated: function(e) {
    var detail = e.detail;
    if (detail.field === "amount") {
      this.setState({
        amount: detail.value
      });
    }
  },
  onStateUpdated: function(e) {
    var detail = e.detail;
    var state = detail.state;
    var value = detail.value;
    if (state === "currency") {
      this.setState({
        currency: value
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
            currency={this.state.currency.code}
          /> : "" }
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
