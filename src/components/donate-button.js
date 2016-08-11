import React from 'react';
import {FormattedMessage, FormattedNumber} from 'react-intl';
import listener from '../lib/listener.js';

module.exports = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      amount: "",
      currency: this.props.currency || {}
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
    if (this.state.amount) {
      return (
        <FormattedMessage
          id='donate_now_amount'
          values={{donationAmount:
            <FormattedNumber
              maximumFractionDigits={2}
              value={this.state.amount}
              style="currency"
              currency={this.state.currency.code}
            />
          }}
        />
      );
    }
    return (
      <span>{this.context.intl.formatMessage({id: "donate_now"})}</span>
    );
  }
});
