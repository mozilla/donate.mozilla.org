import React from 'react';
import dispatcher from '../scripts/input-dispatcher.js';

var regVisa = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
var regMC = /^(?:5[1-5][0-9]{14})$/;
var regAMEX = /^(?:3[47][0-9]{13})$/;

var cardMixin = {
  getInitialState: function() {
    return {
      valid: !this.props.error
    };
  },
  onInput: function(field, value) {
    dispatcher.fieldChange({
      field: field,
      value: value
    });
  },
  onReady: function(field) {
    dispatcher.fieldReady({
      name: this.props.name,
      element: this,
      field: field
    });
  }
};

var CardNumber = React.createClass({
  mixins: [require('react-intl').IntlMixin, cardMixin],
  componentDidMount: function() {
    this.onReady("cardNumber");
  },
  checkCardNumber: function(cardNumber) {
    if (this.props.error) {
      return false;
    }
    cardNumber = cardNumber.replace(/ /g, "");
    if ((cardNumber.match(regVisa) && cardNumber.match(regVisa).length > 0) ||
        (cardNumber.match(regMC) && cardNumber.match(regMC).length > 0) ||
        (cardNumber.match(regAMEX) && cardNumber.match(regAMEX).length > 0)) {
      return true;
    }
    return false;
  },
  focus: function() {
    document.querySelector("#card-number-input").focus();
  },
  validate: function() {
    var valid = true;
    var cardNumber = this.props.value;
    if (!this.checkCardNumber(cardNumber)) {
      valid = false;
      this.setState({
        valid: false
      });
    }
    return valid;
  },
  onCardInput: function(e) {
    var value = e.currentTarget.value;
    if (/^(\d| )*$/.test(value) && value.replace(/ /g, "").length <= 16) {
      if (!this.state.valid && this.checkCardNumber(value)) {
        this.setState({
          valid: true
        });
      }
      this.onInput("cardNumber", value);
    }
  },
  render: function() {
    var className = "";
    if (!this.state.valid || this.props.error) {
      className += "parsley-error";
    }
    return (
      <div className="field-container">
        <i className="fa fa-credit-card field-icon"></i>
        <input type="tel" className={className} id="card-number-input" name="cc_number" onChange={this.onCardInput} value={this.props.value} placeholder={this.getIntlMessage('credit_card_number')} autoComplete="off"/>
      </div>
    );
  }
});

var CardCvc = React.createClass({
  mixins: [require('react-intl').IntlMixin, cardMixin],
  getInitialState: function() {
    return {
      showHint: false
    };
  },
  componentDidMount: function() {
    this.onReady("cvc", this.props.value);
  },
  validate: function() {
    var valid = true;
    if (!/^[0-9]{3,4}$/.test(this.props.value)) {
      valid = false;
      this.setState({
        valid: false
      });
    }
    return valid;
  },
  onCvcInput: function(e) {
    var value = e.currentTarget.value;
    if (/^(\d)*$/.test(value)) {
      if (!this.state.valid) {
        this.setState({
          valid: true
        });
      }
      this.onInput("cvc", value);
    }
  },
  hintClicked: function() {
    dispatcher.fire("toggleCvcHint");
    dispatcher.fire("heightChange");
  },
  render: function() {
    var hintClassIconName = "fa fa-question-circle hint";
    if (this.props.showHint) {
      hintClassIconName += " on";
    }
    var className = "";
    if (!this.state.valid || this.props.error) {
      className += "parsley-error";
    }
    return (
      <div className="field-container">
        <i className="fa fa-lock field-icon"></i>
        <input id="cvc-input" type="tel" className={className} name="cc_cvv" maxLength="4" onChange={this.onCvcInput} value={this.props.value} placeholder={this.getIntlMessage('CVC')} autoComplete="off"/>
        <i onClick={this.hintClicked} className={hintClassIconName}></i>
      </div>
    );
  }
});

var CardExpMonth = React.createClass({
  mixins: [require('react-intl').IntlMixin, cardMixin],
  componentDidMount: function() {
    this.onReady("expMonth", this.props.value);
  },
  validate: function() {
    var valid = true;
    var month = parseInt(this.props.value, 10);
    if (this.props.error || !month || month < 1 || month > 12) {
      valid = false;
      this.setState({
        valid: false
      });
    }
    return valid;
  },
  onExpMonthInput: function(e) {
    var value = e.currentTarget.value;
    if (/^(\d)*$/.test(value)) {
      if (!this.state.valid) {
        this.setState({
          valid: true
        });
      }
      this.onInput("expMonth", value);
    }
  },
  render: function() {
    var className = "";
    if (!this.state.valid || this.props.error) {
      className += "parsley-error";
    }
    return (
      <span className="exp-month-container">
        <i className="fa fa-calendar-o field-icon"></i>
        <input id="exp-month-input" className={className} aria-label={this.getIntlMessage('credit_card_expiration_month')} onChange={this.onExpMonthInput} value={this.props.value} type="tel" placeholder={this.getIntlMessage('MM')} maxLength="2" name="cc_expir_month" autoComplete="off"/>
      </span>
    );
  }
});

var CardExpYear = React.createClass({
  mixins: [require('react-intl').IntlMixin, cardMixin],
  componentDidMount: function() {
    this.onReady("expYear", this.props.value);
  },
  validate: function() {
    var valid = true;
    var year = parseInt(this.props.value, 10);
    if (this.props.error || !year || year < 15) {
      valid = false;
      this.setState({
        valid: false
      });
    }
    return valid;
  },
  onExpYearInput: function(e) {
    var value = e.currentTarget.value;
    if (/^(\d)*$/.test(value)) {
      if (!this.state.valid) {
        this.setState({
          valid: true
        });
      }
      this.onInput("expYear", value);
    }
  },
  render: function() {
    var className = "";
    if (!this.state.valid || this.props.error) {
      className += "parsley-error";
    }
    return (
      <span className="exp-year-container">
        <input id="exp-year-input" className={className} aria-label={this.getIntlMessage('credit_card_expiration_year')} onChange={this.onExpYearInput} value={this.props.value} type="tel" placeholder={this.getIntlMessage('YY')} maxLength="2" name="cc_expir_year" autoComplete="off"/>
      </span>
    );
  }
});

module.exports = {
  CardNumber: CardNumber,
  CardCvc: CardCvc,
  CardExpMonth: CardExpMonth,
  CardExpYear: CardExpYear
};
