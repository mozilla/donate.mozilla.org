import React from 'react';
import currencies from '../data/currencies.js';
import reactGA from 'react-ga';

var PayPalButton = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  propTypes: {
    onClick: React.PropTypes.func,
    submitting: React.PropTypes.bool,
    validate: React.PropTypes.array,
    submit: React.PropTypes.array.isRequired,
    name: React.PropTypes.string.isRequired
  },
  onChange: function() {
    if (this.props.onClick) {
      this.props.onClick();
    }
    if (!this.props.submitting) {
      this.props.onSubmit(this.props.validate, this.props.submit);
    }
    reactGA.event({
      category: "User Flow",
      action: "PayPal Clicked"
    });
  },
  renderButton: function() {
    if (this.props.submitting) {
      return (
        <div className="submitting-container"><i className="fa fa-cog fa-spin"/>{this.context.intl.formatMessage({id: 'submitting'})}</div>
      );
    }
    return (
      <span>
        <div className="row medium-label-size donate-button">{this.context.intl.formatMessage({id: 'donate_button'})}</div>
        <div className="row payment-logos paypal-logo">
          <p>&nbsp;</p>
        </div>
        <div className="row medium-label-size less-text">PayPal</div>
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
        <input type="hidden" name="item_name_monthly" value={this.context.intl.formatMessage({id: "mozilla_donation"})}/>
      </div>
    );
  }
});

var StripeButton = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  propTypes: {
    onClick: React.PropTypes.func,
    submitting: React.PropTypes.bool,
    validate: React.PropTypes.array.isRequired,
    name: React.PropTypes.string.isRequired,
    currency: React.PropTypes.object.isRequired
  },
  onChange: function() {
    if (this.props.onClick) {
      this.props.onClick();
    }
    setTimeout(() => {
      this.props.onSubmit(this.props.validate, this.props.submit);
    });
    reactGA.event({
      category: "User Flow",
      action: "Stripe Clicked"
    });
  },
  render: function() {
    var name = this.props.name;
    var labelId = "payment-cc-" + name;
    var className = "row payment-logos credit-card-logos";
    if (currencies[this.props.currency.code].amexDisabled) {
      className += " no-amex";
    }
    return (
      <div className="half">
        <input onChange={this.onChange} type="radio" className="payment-type payment-cc-input" name={name} value="cc" id={labelId}/>
        <label className="payment-cc-label" htmlFor={labelId}>
          <div className="row medium-label-size donate-button">{this.context.intl.formatMessage({id: 'donate_button'})}</div>
          <div className={className}>
            <p>&nbsp;</p>
          </div>
          <div className="row medium-label-size less-text">{this.context.intl.formatMessage({id: 'credit_card'})}</div>
        </label>
      </div>
    );
  }
});

module.exports = {
  PayPalButton: PayPalButton,
  StripeButton: StripeButton
};
