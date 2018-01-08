import React from 'react';
import currencyData from '../data/currencies.js';
import reactGA from 'react-ga';
import { connect } from 'react-redux';
import { setCurrency } from '../actions';

var CurrencyDropdown = React.createClass({
  onChange: function(e) {
    var currency = currencyData[e.currentTarget.value];
    if (currency) {
      this.props.setCurrency(currency);
      reactGA.event({
        category: "User Flow",
        action: "Changed Currency",
        label: currency.code
      });
    }
  },
  render: function() {
    return (
      <select onChange={this.onChange} autoComplete="off" className="currency-dropdown" value={this.props.currency.code}>
        {Object.keys(currencyData).map(function(currency, i) {
          return (
            <option value={currency} key={i}>
              {currency.toUpperCase()} &nbsp; {currencyData[currency].symbol}
            </option>
          );
        })}
      </select>
    );
  }
});

module.exports = connect(
  function(state) {
    return {
      currency: state.donateForm.currency
    };
  },
  function(dispatch) {
    return {
      setCurrency: function(data) {
        dispatch(setCurrency(data));
      }
    };
  })(CurrencyDropdown);
