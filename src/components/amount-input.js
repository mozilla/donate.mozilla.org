import React from 'react';

var AmountInput = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  getInitialState: function() {
    var amount = this.props.amount;
    if (amount) {
      amount = this.context.intl.formatNumber(amount);
    }
    return {
      inputValue: amount
    };
  },
  componentWillReceiveProps: function(nextProps) {
    var amount = nextProps.amount;
    var inputValue = this.state.inputValue;
    if (!amount && inputValue) {
      this.setState({
        inputValue: ""
      });
    } else if (amount && !inputValue) {
      this.setState({
        inputValue: this.context.intl.formatNumber(amount)
      });
    }
  },
  onInputChange: function(e) {
    var inputValue = e.currentTarget.value;
    var amount = "";

    // TODO: This needs to be refactored to use regex replace
    // and needs documentation for what they are matching.
    // See https://github.com/mozilla/donate.mozilla.org/issues/1917
    if (/^[\d]*[.]?\d{0,2}$/.test(inputValue)) {
      amount = inputValue.replace(/,/g, "");
    } else if (/^[\d]*[,]?\d{0,2}$/.test(inputValue)) {
      amount = inputValue.replace(/\./g, "").replace(",", ".");
    } else if (/^[\d,]*[.]?\d{0,2}$/.test(inputValue)) {
      amount = inputValue.replace(/,/g, "");
    } else if (/^[\d.]*[,]?\d{0,2}$/.test(inputValue)) {
      amount = inputValue.replace(/\./g, "").replace(",", ".");
    } else {
      inputValue = this.state.inputValue;
    }

    if (this.state.inputValue !== inputValue) {
      this.setState({
        inputValue: inputValue
      });
      this.props.onInputChange(amount);
    }
  },
  onClick: function(e) {
    if (this.props.onInputClick) {
      this.props.onInputClick(e);
    }
  },
  render: function() {
    var inputValue = this.state.inputValue;
    if (!this.props.amount) {
      inputValue = "";
    }
    var id = this.props.id || "";
    var className = this.props.className || "";
    var placeholder = this.props.placeholder || "";
    var type = this.props.type || "";
    return (
      <input id={id}
        autoComplete="off"
        className={className}
        type={type}
        value={inputValue}
        onClick={this.onClick}
        placeholder={placeholder}
        onChange={this.onInputChange}
      />
    );
  }
});

module.exports = AmountInput;
