import React from 'react';

module.exports = React.createClass({
  render: function () {
    var currencies = this.props.currencies;
    return (
      <select onChange={this.props.onChange} className="currency-dropdown" value={this.props.currency}>
        {Object.keys(currencies).map(function (currency, i) {
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
