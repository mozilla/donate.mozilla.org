import React from 'react';
import dispatcher from '../scripts/dispatcher.js';

module.exports = React.createClass({
  propTypes: {
    currencies: React.PropTypes.object.isRequired,
    currency: React.PropTypes.string.isRequired
  },
  onChange: function(e) {
    dispatcher.fire("currencyChange", {
      value: e.currentTarget.value
    });
  },
  render: function() {
    var currencies = this.props.currencies;
    return (
      <select onChange={this.onChange} className="currency-dropdown" value={this.props.currency}>
        {Object.keys(currencies).map(function(currency, i) {
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
