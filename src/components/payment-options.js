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
    onSubmit: React.PropTypes.func.isRequired,
    name: React.PropTypes.string.isRequired
  },
  onClick: function() {
    if (this.props.onClick) {
      this.props.onClick();
    }
    if (!this.props.submitting) {
      this.props.onSubmit();
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
      <div>
        <div className="row medium-label-size donate-button">{this.context.intl.formatMessage({id: 'donate_button_uppercase'})}</div>
        <div className="row payment-logos paypal-logo">
          <p>&nbsp;</p>
        </div>
        <div className="row medium-label-size less-text">PayPal</div>
      </div>
    );
  },
  render: function() {
    var name = this.props.name;
    var labelId = "payment-paypal-" + name;
    return (
      <div className="half paypal-button">
        <input onClick={this.onClick} type="radio" className="payment-type payment-paypal-input" name={name} value="paypal" id={labelId}/>
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
    name: React.PropTypes.string.isRequired,
    currency: React.PropTypes.object.isRequired,
    onSubmit: React.PropTypes.func.isRequired
  },
  onClick: function() {
    if (this.props.onClick) {
      this.props.onClick();
    }
    if (!this.props.submitting) {
      this.props.onSubmit();
    }
    reactGA.event({
      category: "User Flow",
      action: "Stripe Clicked"
    });
  },
  renderButton: function() {
    if (this.props.submitting) {
      return (
        <div className="submitting-container"><i className="fa fa-cog fa-spin"/>{this.context.intl.formatMessage({id: 'submitting'})}</div>
      );
    }
    var className = "row payment-logos credit-card-logos";
    if (this.props.currency.code !== "usd") {
      className += " no-discover";
    }
    if (currencies[this.props.currency.code].amexDisabled) {
      className += " no-amex";
    }
    return (
      <div>
        <div className="row medium-label-size donate-button">{this.context.intl.formatMessage({id: 'donate_button_uppercase'})}</div>
        <div className={className}>
          <p>&nbsp;</p>
        </div>
        <div className="row medium-label-size less-text">{this.context.intl.formatMessage({id: 'credit_card'})}</div>
      </div>
    );
  },
  componentDidMount: function() {
    // Need this because Chrome on iOS plus StripeCheckout triggers a popup.
    // We need to ensure the popup isn't blocked.
    this.input.addEventListener("click", this.onClick);
  },
  componentWillUnmount: function() {
    // Need to ensure we remove it, or else we'll have a memory leak.
    // This is why you don't use DOM events in React.
    this.input.removeEventListener("click", this.onClick);
  },
  render: function() {
    var name = this.props.name;
    var labelId = "payment-cc-" + name;
    return (
      <div className="half cc-button">
        <input ref={(input) => { this.input = input; }} type="radio" className="payment-type payment-cc-input" name={name} value="cc" id={labelId}/>
        <label className="payment-cc-label" htmlFor={labelId}>
          {this.renderButton()}
        </label>
      </div>
    );
  }
});

module.exports = {
  PayPalButton: PayPalButton,
  StripeButton: StripeButton
};
