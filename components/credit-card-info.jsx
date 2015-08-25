import React from 'react';

var CreditCardInfo = React.createClass({
  mixins: [require('react-intl').IntlMixin, require("../mixins/input.jsx")],
  getInitialState: function() {
    return {
      showHint: false,
      values: {
        cardNumber: "",
        expMonth: "",
        expYear: "",
        cvc: "",
      },
      cardNumberValid: true,
      expMonthValid: true,
      expYearValid: true,
      cvcValid: true
    };
  },
  hintClicked: function() {
    this.setState({
      showHint: !this.state.showHint
    });
    this.onChange();
  },
  validate: function() {
    return this.validateFields(["cardNumber", "expMonth", "expYear", "cvc"]);
  },
  focus: function() {
    document.querySelector("#card-number-input").focus();
  },
  onCardInput: function(e) {
    this.onInput("cardNumber", e.currentTarget.value);
  },
  onExpMonthInput: function(e) {
    this.onInput("expMonth", e.currentTarget.value);
  },
  onExpYearInput: function(e) {
    this.onInput("expYear", e.currentTarget.value);
  },
  onCvcInput: function(e) {
    this.onInput("cvc", e.currentTarget.value);
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
    if (!this.state.cardNumberValid) {
      cardClassName += "parsley-error";
    }
    var monthClassName = "";
    if (!this.state.expMonthValid) {
      monthClassName += "parsley-error";
    }
    var yearClassName = "";
    if (!this.state.expYearValid) {
      yearClassName += "parsley-error";
    }
    var cvcClassName = "";
    if (!this.state.cvcValid) {
      cvcClassName += "parsley-error";
    }
    return (
      <div>
        <div className="row">
          <div className="full">
            <div className="field-container">
              <i className="fa fa-credit-card field-icon"></i>
              <input type="tel" className={cardClassName} id="card-number-input" name="cc_number" onChange={this.onCardInput} value={this.state.values.cardNumber} placeholder={this.getIntlMessage('credit_card_number')} maxLength="16" autoComplete="off"/>
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
              <img src="https://ddz69tinzt56n.cloudfront.net/images/CVC-illustration.png" className="left"/>
              <div className="">{this.getIntlMessage('cvc_info')}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = CreditCardInfo;
