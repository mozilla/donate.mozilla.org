import React from 'react';
import {FormattedMessage, IntlMixin, FormattedNumber} from 'react-intl';
import listener from '../scripts/listener.js';

module.exports = React.createClass({
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
              currency={this.props.currency || "usd"}
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
