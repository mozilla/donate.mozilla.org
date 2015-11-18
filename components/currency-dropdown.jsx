import React from 'react';
import currencyData from '../data/currencies.js';
import listener from '../scripts/listener.js';
import form from '../scripts/form.js';

module.exports = React.createClass({
  getInitialState: function() {
    return {
      currency: {}
    };
  },
  componentDidMount: function() {
    listener.on("stateUpdated", this.onStateUpdated);
  },
  componentWillUnmount: function() {
    listener.off("stateUpdated", this.onStateUpdated);
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
  onChange: function(e) {
    var currency = currencyData[e.currentTarget.value];
    if (currency) {
      form.updateState("currency", currency);
    }
  },
  render: function() {
    return (
      <select onChange={this.onChange} className="currency-dropdown" value={this.state.currency.code}>
        {Object.keys(currencyData).map(function(currency, i) {
          return (
            <option value={currency} key={i}>
              {currency}
            </option>
          );
        })}
      </select>
    );
  }
});
