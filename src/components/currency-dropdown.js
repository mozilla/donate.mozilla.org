import React from 'react';
import currencyData from '../data/currencies.js';
import listener from '../lib/listener.js';
import form from '../lib/form.js';
import reactGA from 'react-ga';

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
      reactGA.event({
        category: "User Flow",
        action: "Changed Currency",
        label: currency.code
      });
    }
  },
  render: function() {
    return (
      <select onChange={this.onChange} className="currency-dropdown" value={this.state.currency.code}>
        {Object.keys(currencyData).map(function(currency, i) {
          return (
            <option value={currency} key={i}>
              {currency} &nbsp; {currencyData[currency].symbol}
            </option>
          );
        })}
      </select>
    );
  }
});
