import React from 'react';

var regVisa = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
var regMC = /^(?:5[1-5][0-9]{14})$/;
var regAMEX = /^(?:3[47][0-9]{13})$/;

var CreditCardInfo = React.createClass({
  mixins: [require('react-intl').IntlMixin, require("../mixins/input.jsx")],
  getInitialState: function() {
    return {
      showHint: false,
      values: {
        cardNumber: "",
        expMonth: "",
        expYear: "",
        cvc: ""
      },
      cardNumberValid: !this.props.error.number,
      expMonthValid: !this.props.error.monthExp,
      expYearValid: !this.props.error.yearExp,
      cvcValid: !this.props.error.cvc
    };
  },
  hintClicked: function() {
    this.setState({
      showHint: !this.state.showHint
    });
    this.onChange();
  },
  checkCardNumber: function(cardNumber) {
    if (this.props.error.number) {
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
  validate: function() {
    var valid = this.validateFields(["cvc"]);
    var cardNumber = this.state.values.cardNumber;
    if (!this.checkCardNumber(cardNumber)) {
      valid = false;
      this.setState({
        cardNumberValid: false
      });
    }
    var year = parseInt(this.state.values.expYear, 10);
    if (this.props.error.yearExp || !year || year < 15) {
      valid = false;
      this.setState({
        expYearValid: false
      });
    }
    var month = parseInt(this.state.values.expMonth, 10);
    if (this.props.error.monthExp || !month || month < 1 || month > 12) {
      valid = false;
      this.setState({
        expMonthValid: false
      });
    }
    return valid;
  },
  focus: function() {
    document.querySelector("#card-number-input").focus();
  },
  onCardInput: function(e) {
    var value = e.currentTarget.value;
    var state = this.state;
    if (/^(\d| )*$/.test(value) && value.replace(/ /g, "").length <= 16) {
      state.values.cardNumber = value;
      if (this.checkCardNumber(value)) {
        state.cardNumberValid = true;
      }
      this.setState(state);
      this.onChange("number");
    }
  },
  onExpMonthInput: function(e) {
    var value = e.currentTarget.value;
    if (/^(\d)*$/.test(value)) {
      this.onInput("expMonth", value);
    }
  },
  onExpYearInput: function(e) {
    var value = e.currentTarget.value;
    if (/^(\d)*$/.test(value)) {
      this.onInput("expYear", value);
    }
  },
  onCvcInput: function(e) {
    var value = e.currentTarget.value;
    if (/^(\d)*$/.test(value)) {
      this.onInput("cvc", value);
    }
  },
  render: function() {
    var hintClassIconName = "fa fa-question-circle hint";
    var hintClassName = "hint-msg small";
    if (this.state.showHint) {
      hintClassIconName += " on";
    } else {
      hintClassName += " hidden";
    }
    var cardClassName = "";
    if (!this.state.cardNumberValid || this.props.error.number) {
      cardClassName += "parsley-error";
    }
    var monthClassName = "";
    if (!this.state.expMonthValid || this.props.error.monthExp) {
      monthClassName += "parsley-error";
    }
    var yearClassName = "";
    if (!this.state.expYearValid || this.props.error.yearExp) {
      yearClassName += "parsley-error";
    }
    var cvcClassName = "";
    if (!this.state.cvcValid || this.props.error.cvc) {
      cvcClassName += "parsley-error";
    }
    var errorMessageClassName = "row error-msg-row";
    var errorMessage = "";
    if (this.props.error.number) {
      errorMessage = this.props.error.number;
    } else if (this.props.error.cvc) {
      errorMessage = this.props.error.cvc;
    } else if (this.props.error.monthExp) {
      errorMessage = this.props.error.monthExp;
    } else if (this.props.error.yearExp) {
      errorMessage = this.props.error.yearExp;
    }
    if (errorMessage === "") {
      errorMessageClassName += " hidden";
    }
    var cardNumber = this.state.values.cardNumber;
    return (
      <div>
        <div className="row">
          <div className="full">
            <div className="field-container">
              <i className="fa fa-credit-card field-icon"></i>
              <input type="tel" className={cardClassName} id="card-number-input" name="cc_number" onChange={this.onCardInput} value={cardNumber} placeholder={this.getIntlMessage('credit_card_number')} autoComplete="off"/>
            </div>
          </div>
        </div>
        <div className="row hint-msg-parent">
          <div className="half">
            <div className="field-container">
              <i className="fa fa-calendar-o field-icon"></i>
              <input id="exp-month-input" className={monthClassName} aria-label={this.getIntlMessage('credit_card_expiration_month')} onChange={this.onExpMonthInput} value={this.state.values.expMonth} type="tel" placeholder={this.getIntlMessage('MM')} maxLength="2" name="cc_expir_month" autoComplete="off"/>
              &nbsp;&frasl;&nbsp;
              <input id="exp-year-input" className={yearClassName} aria-label={this.getIntlMessage('credit_card_expiration_year')} onChange={this.onExpYearInput} value={this.state.values.expYear} type="tel" placeholder={this.getIntlMessage('YY')} maxLength="2" name="cc_expir_year" autoComplete="off"/>
            </div>
          </div>
          <div className="half">
            <div className="field-container">
              <i className="fa fa-lock field-icon"></i>
              <input id="cvc-input" type="tel" className={cvcClassName} name="cc_cvv" maxLength="4" onChange={this.onCvcInput} value={this.state.values.cvc} placeholder={this.getIntlMessage('CVC')} autoComplete="off"/>
              <i onClick={this.hintClicked} className={hintClassIconName}></i>
            </div>
          </div>
          <div className="full">
            <div className={hintClassName}>
              <img src="/images/CVC-illustration.png" className="left"/>
              <div className="">{this.getIntlMessage('cvc_info')}</div>
            </div>
          </div>
        </div>
        <div className={errorMessageClassName}>
          <div className="full">
            <div id="amount-error-msg">
              <ul id="parsley-id-multiple-donation_amount" className="parsley-errors-list filled">
                <li className="parsley-custom-error-message">
                  {errorMessage}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = CreditCardInfo;
