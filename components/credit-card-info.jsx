import React from 'react';
import listener from '../scripts/listener.js';
import dispatcher from '../scripts/dispatcher.js';
import form from '../scripts/form.js';
import {injectIntl} from 'react-intl';

var regVisa = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
var regMC = /^(?:5[1-5][0-9]{14})$/;
var regAMEX = /^(?:3[47][0-9]{13})$/;

var cardInfoMixin = {
  propTypes: {
    name: React.PropTypes.string.isRequired,
    field: React.PropTypes.string.isRequired
  },
  getInitialState: function() {
    return {
      value: "",
      valid: true,
      error: ""
    };
  },
  componentDidMount: function() {
    listener.on("formError", this.onError);
    listener.on("fieldUpdated", this.onFieldUpdated);
    form.registerField({
      name: this.props.name,
      element: this,
      field: this.props.field
    });
  },
  componentWillUnmount: function() {
    listener.off("formError", this.onError);
    listener.off("fieldUpdated", this.onFieldUpdated);
  },
  onError: function(e) {
    var detail = e.detail;
    var message = detail.message;
    var field = detail.field;
    var valid = !message;
    if (field === this.props.field) {
      this.setState({
        error: message,
        valid: valid
      });
    }
  },
  onFieldUpdated: function(e) {
    var detail = e.detail;
    if (detail.field === this.props.field) {
      this.setState({
        value: detail.value
      });
    }
  },
  validate: function() {
    var valid = true;
    var value = this.state.value;
    if (!value || !value.trim()) {
      form.error(this.props.field, this.props.intl.formatMessage({id: "please_complete"}));
    }
    if (!this.validateTest(value) || this.state.error) {
      valid = false;
      this.setState({
        valid: false
      });
    }
    return valid;
  },
  onInput: function(e) {
    var value = e.currentTarget.value;
    if (this.inputTest(value)) {
      if (!this.state.valid) {
        this.setState({
          valid: true
        });
        form.error(this.props.field, "");
      }
      form.updateField(this.props.field, e.currentTarget.value);
    }
  }
};

var CardNumber = injectIntl(React.createClass({
  mixins: [cardInfoMixin],
  validateTest: function(cardNumber) {
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
  inputTest: function(value) {
    return /^(\d| )*$/.test(value) && value.replace(/ /g, "").length <= 16;
  },
  render: function() {
    var className = "";
    if (!this.state.valid || this.state.error) {
      className += "parsley-error";
    }
    return (
      <div className="field-container">
        <i className="fa fa-credit-card field-icon"></i>
        <input type="tel" className={className} id="card-number-input" name={this.props.name} onChange={this.onInput} value={this.state.value} placeholder={this.props.intl.formatMessage({id: 'credit_card_number'})} autoComplete="off"/>
      </div>
    );
  }
}));

var CardCvc = injectIntl(React.createClass({
  mixins: [cardInfoMixin],
  validateTest: function(value) {
    return /^[0-9]{3,4}$/.test(this.state.value);
  },
  inputTest: function(value) {
    return /^(\d)*$/.test(value);
  },
  hintClicked: function() {
    dispatcher.fire("toggleCvcHint");
  },
  render: function() {
    var hintClassIconName = "fa fa-question-circle hint";
    if (this.props.showHint) {
      hintClassIconName += " on";
    }
    var className = "";
    if (!this.state.valid || this.state.error) {
      className += "parsley-error";
    }
    return (
      <div className="field-container">
        <i className="fa fa-lock field-icon"></i>
        <input id="cvc-input" type="tel" className={className} name={this.props.name} maxLength="4" onChange={this.onInput} value={this.state.value} placeholder={this.props.intl.formatMessage({id: 'CVC'})} autoComplete="off"/>
        <i onClick={this.hintClicked} className={hintClassIconName}></i>
      </div>
    );
  }
}));

var CardExpMonth = injectIntl(React.createClass({
  mixins: [cardInfoMixin],
  validateTest: function(value) {
    var month = parseInt(this.state.value, 10);
    if (!month || month < 1 || month > 12) {
      return false;
    }
    return true;
  },
  inputTest: function(value) {
    return /^(\d)*$/.test(value);
  },
  render: function() {
    var className = "";
    if (!this.state.valid || this.state.error) {
      className += "parsley-error";
    }
    return (
      <span className="exp-month-container">
        <i className="fa fa-calendar-o field-icon"></i>
        <input id="exp-month-input" className={className} aria-label={this.props.intl.formatMessage({id: 'credit_card_expiration_month'})} onChange={this.onInput} value={this.state.expMonth} type="tel" placeholder={this.props.intl.formatMessage({id: 'MM'})} maxLength="2" name={this.props.name} autoComplete="off"/>
      </span>
    );
  }
}));

var CardExpYear = injectIntl(React.createClass({
  mixins: [cardInfoMixin],
  validateTest: function(value) {
    var year = parseInt(this.state.value, 10);
    if (!year || year < 15) {
      return false;
    }
    return true;
  },
  inputTest: function(value) {
    return /^(\d)*$/.test(value);
  },
  render: function() {
    var className = "";
    if (!this.state.valid || this.state.error) {
      className += "parsley-error";
    }
    return (
      <span className="exp-year-container">
        <input id="exp-year-input" className={className} aria-label={this.props.intl.formatMessage({id: 'credit_card_expiration_year'})} onChange={this.onInput} value={this.state.value} type="tel" placeholder={this.props.intl.formatMessage({id: 'YY'})} maxLength="2" name={this.props.name} autoComplete="off"/>
      </span>
    );
  }
}));

module.exports = {
  CardNumber: injectIntl(React.createClass({
    focus: function() {
      this.refs.ccNumber.refs.wrappedElement.focus();
    },
    render: function() {
      return (
        <CardNumber ref="ccNumber" {...this.props} field="cardNumber"/>
      );
    }
  })),
  CardCvc: injectIntl(React.createClass({
    render: function() {
      return (
        <CardCvc {...this.props} field="cvc"/>
      );
    }
  })),
  CardExpMonth: injectIntl(React.createClass({
    render: function() {
      return (
        <CardExpMonth {...this.props} field="expMonth"/>
      );
    }
  })),
  CardExpYear: injectIntl(React.createClass({
    render: function() {
      return (
        <CardExpYear {...this.props} field="expYear"/>
      );
    }
  }))
};
