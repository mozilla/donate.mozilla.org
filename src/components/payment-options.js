import React from 'react';
import currencies from '../data/currencies.js';
import reactGA from 'react-ga';


//
// TODO: This code is highly repetitive, and can be
//       cleaned up considerably either by object
//       unification prior to calling createClass,
//       or using ES6, which will then require making
//       sure to update the onHandlestuff logic so that
//       arrow functions are used, to preserve "this".
//


/**
 * A PayPal payment method button class.
 */
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
  render: function() {
    var name = this.props.name;
    var inputId = "payment-paypal-" + name;
    return (
      <div className="paypal-button">
        <input
          onClick={this.onClick}
          type="radio"
          className="payment-type payment-paypal-input"
          name={name}
          value="paypal"
          id={inputId}
        />
        <label className="payment-paypal-label" htmlFor={inputId}>
          {this.renderButton()}
        </label>
        <input type="hidden" name="item_name_monthly" value={this.context.intl.formatMessage({id: "mozilla_donation"})}/>
      </div>
    );
  },
  renderButton: function() {
    if (this.props.submitting) {
      return (
        <div className="submitting-container"><i className="progress-cog fa-spin"/>{this.context.intl.formatMessage({id: 'submitting'})}</div>
      );
    }
    return (
      <div>
        <div className="row medium-label-size donate-button">{this.context.intl.formatMessage({id: 'donate_button'})}</div>
        <div className="row payment-logos paypal-logo"></div>
        <div className="row medium-label-size less-text">PayPal</div>
      </div>
    );
  }
});


/**
 * A Stripe Checkout payment method button class.
 */
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
    var inputId = "payment-cc-" + name;
    return (
      <div className="cc-button">
        <input
          ref={(input) => { this.input = input; }}
          type="radio"
          className="payment-type payment-cc-input"
          name={name}
          value="cc"
          id={inputId}
        />
        <label className="payment-cc-label" htmlFor={inputId}>
          {this.renderButton()}
        </label>
      </div>
    );
  },
  renderButton: function() {
    if (this.props.submitting) {
      return (
        <div className="submitting-container"><i className="progress-cog fa-spin"/>{this.context.intl.formatMessage({id: 'submitting'})}</div>
      );
    }
    var className = "row payment-logos credit-card-logos";
    if (currencies[this.props.currency.code].amexDisabled) {
      className += " no-amex";
    }
    return (
      <div>
        <div className="row medium-label-size donate-button">{this.context.intl.formatMessage({id: 'donate_button'})}</div>
        <div className={className}></div>
        <div className="row medium-label-size less-text">{this.context.intl.formatMessage({id: 'credit_card'})}</div>
      </div>
    );
  }
});


/**
 * A Stripe payment method button class,
 * specifically for SEPA payments.
 */
var SEPAButton = React.createClass({
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
      action: "SEPA Clicked"
    });
  },
  componentDidMount: function() {
    // TODO: do we need the same protection as for Stripe?
    this.input.addEventListener("click", this.onClick);
  },
  componentWillUnmount: function() {
    // TODO: do we need the same protection as for Stripe?
    this.input.removeEventListener("click", this.onClick);
  },
  render: function() {
    var name = this.props.name;
    var inputId = "payment-sepa-" + name;
    return (
      <div className="sepa-button" hidden={this.props.hidden}>
        <input
          ref={(input) => { this.input = input; }}
          type="radio"
          className="payment-type payment-sepa-input"
          name={name}
          value="sepa"
          id={inputId}
        />
        <label className="payment-sepa-label" htmlFor={inputId}>
          {this.renderButton()}
        </label>
      </div>
    );
  },
  renderButton: function() {
    if (this.props.submitting) {
      return (
        <div className="submitting-container"><i className="progress-cog fa-spin"/>{this.context.intl.formatMessage({id: 'submitting'})}</div>
      );
    }
    var className = "row payment-logos sepa-logo";
    return (
      <div>
        <div className="row medium-label-size donate-button">{this.context.intl.formatMessage({id: 'donate_button'})}</div>
        <div className={className}></div>
        <div className="row medium-label-size less-text">{this.context.intl.formatMessage({id: 'credit_card'})}</div>
      </div>
    );
  }
});

module.exports = {
  PayPalButton: PayPalButton,
  StripeButton: StripeButton,
  SEPAButton: SEPAButton
};
