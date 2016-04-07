import React from 'react';
import {FormattedMessage, IntlMixin, FormattedNumber} from 'react-intl';
import listener from '../scripts/listener.js';

module.exports = React.createClass({
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
  mixins: [IntlMixin],
  render: function() {
    if (this.state.amount) {
      return (
        <FormattedMessage
          message={this.getIntlMessage('donate_now_amount')}
          donationAmount={
            <FormattedNumber
              maximumFractionDigits={2}
              value={this.state.amount}
              style="currency"
              currency={this.state.currency.code}
            />
          }
        />
      );
    }
    return (
      <span>{this.getIntlMessage("donate_now")}</span>
    );
  }
});
