import React from 'react';
import {IntlMixin} from 'react-intl';

var PayPalButton = React.createClass({
  mixins: [IntlMixin],
  propTypes: {
    onClick: React.PropTypes.func,
    submitting: React.PropTypes.bool,
    validate: React.PropTypes.array,
    submit: React.PropTypes.array.isRequired,
    name: React.PropTypes.string.isRequired
  },
  onChange: function() {
    this.props.onClick = this.props.onClick || function() {};
    this.props.onClick();
    if (!this.props.submitting) {
      this.props.onSubmit(this.props.validate, this.props.submit);
    }
  },
  renderButton: function() {
    if (this.props.submitting) {
      return (
        <div className="submitting-container"><i className="fa fa-cog fa-spin"/>{this.getIntlMessage('submitting')}</div>
      );
    }
    return (
      <span>
        <div className="row payment-logos paypal-logo">
          <p>&nbsp;</p>
        </div>
        <div className="row medium-label-size">PayPal</div>
      </span>
    );
  },
  render: function() {
    var name = this.props.name;
    var labelId = "payment-paypal-" + name;
    return (
      <div className="half paypal-button">
        <input onChange={this.onChange} type="radio" className="payment-type payment-paypal-input" name={name} value="paypal" id={labelId}/>
        <label className="payment-paypal-label" htmlFor={labelId}>
          {this.renderButton()}
        </label>
        <input type="hidden" name="item_name_monthly" value={this.getIntlMessage("mozilla_donation")}/>
      </div>
    );
  }
});

var StripeButton = React.createClass({
  mixins: [IntlMixin],
  propTypes: {
    onClick: React.PropTypes.func,
    submitting: React.PropTypes.bool,
    validate: React.PropTypes.array.isRequired,
    name: React.PropTypes.string.isRequired
  },
  onChange: function() {
    this.props.onClick = this.props.onClick || function() {};
    this.props.onClick();
    setTimeout(() => {
      this.props.onSubmit(this.props.validate, this.props.submit);
    });
  },
  render: function() {
    var name = this.props.name;
    var labelId = "payment-cc-" + name;
    return (
      <div className="half">
        <input onChange={this.onChange} type="radio" className="payment-type payment-cc-input" name={name} value="cc" id={labelId}/>
        <label className="payment-cc-label" htmlFor={labelId}>
          <div className="row payment-logos credit-card-logos">
            <p>&nbsp;</p>
          </div>
          <div className="row medium-label-size">{this.getIntlMessage('credit_card')}</div>
        </label>
      </div>
    );
  }
});

var CreditCardButton = React.createClass({
  mixins: [IntlMixin],
  propTypes: {
    onClick: React.PropTypes.func.isRequired,
    name: React.PropTypes.string.isRequired
  },
  render: function() {
    var name = this.props.name;
    var labelId = "payment-cc-" + name;
    return (
      <div onClick={this.props.onClick} className="half">
        <input type="radio" className="payment-type payment-cc-input" name={name} value="cc" id={labelId}/>
        <label className="payment-cc-label" htmlFor={labelId}>
          <div className="row payment-logos credit-card-logos">
            <p>&nbsp;</p>
          </div>
          <div className="row medium-label-size">{this.getIntlMessage('credit_card')}</div>
        </label>
      </div>
    );
  }
});

module.exports = {
  PayPalButton: PayPalButton,
  StripeButton: StripeButton,
  CreditCardButton: CreditCardButton
};
