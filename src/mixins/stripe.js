import React from 'react';
import amountModifier from '../lib/amount-modifier';
import submit from '../lib/submit';
import reactGA from 'react-ga';

var NOT_SUBMITTING = 0;
var STRIPE_SUBMITTING = 2;

var StripeMixin = {
  contextTypes: {
    intl: React.PropTypes.object
  },
  stripeSuccess: function(data) {
    this.doStripeSuccess(data, "thank-you");
  },
  thunderbirdStripeSuccess: function(data) {
    this.doStripeSuccess(data, "thunderbird/thank-you");
  },
  doStripeSuccess: function(data, location) {
    var transactionId = data.id;
    var amount;
    var currency;
    var email = data.email || "";
    var country = data.country || "";
    var donationFrequency = data.frequency;
    var customerId = data.customerId;

    if (donationFrequency === "monthly") {
      currency = data.currency;
      // Stripe plans are a multiple of the currencies equivilent of Cents
      // e.g. £5/month = 500 £0.01 subscriptions
      amount = data.quantity;
    } else {
      amount = data.amount;
      currency = data.currency;
    }

    location = location || "thank-you";
    // If we are already signed up, send to share.
    if (data.signup) {
      location = "share";
      email = "";
      country = "";
    }

    var params = '?payment=Stripe&str_amount=' + amount + '&str_currency=' + currency + '&str_id=' +transactionId + '&str_frequency=' + donationFrequency + '&customer_id=' + customerId;

    if (email) {
      params += "&email=" + email;
    }
    if (country) {
      params += "&country=" + country;
    }
    var page = '/' + this.context.intl.locale + '/' + location + '/';
    window.location = page + params;
  },
  stripeError: function(error) {
    this.setState({
      submitting: NOT_SUBMITTING,
      stripeError: this.context.intl.formatMessage({id: 'could_not_complete'}) + " [" + error + "]"
    });
    reactGA.event({
      category: "User Flow",
      action: "Card Error",
      label: error
    });
  },
  stripeCheckout: function(props) {
    var success = this.stripeSuccess;
    var error = this.stripeError;
    var description = this.context.intl.formatMessage({id: "mozilla_donation"});
    var handlerDesc = this.context.intl.formatMessage({id: "donate_now"});
    var appName = props.appName;
    var currency = props.currency;
    var locale = this.context.intl.locale;
    var amount = props.amount;
    // Stripe uses the same closed callback for closing the input and success.
    // We only want to stop the spinner if it's closed via the x button.
    // Once we get a token, don't close the spinner until we get an error.
    var formClosable = true;
    if (this.state.submitting !== NOT_SUBMITTING) {
      return;
    }
    this.setState({
      submitting: STRIPE_SUBMITTING
    });

    if (appName === "thunderbird") {
      description = "Thunderbird";
      success = this.thunderbirdStripeSuccess;
    } else if (appName === "glassroomnyc") {
      description = "glassroomnyc";
    }
    if (props.frequency === "monthly") {
      description = this.context.intl.formatMessage({id: "mozilla_monthly_donation"});
      handlerDesc = this.context.intl.formatMessage({id: "donate_monthly"});
      if (appName === "thunderbird") {
        description = "Thunderbird monthly";
      } else if (appName === "glassroomnyc") {
        description = "glassroomnyc monthly";
      }
    }

    var handler = StripeCheckout.configure({
      // Need to get this from .env
      key: process.env.STRIPE_PUBLIC_KEY,
      image: process.env.APPLICATION_URI + '/assets/images/mozilla-circular.911f4f7f4e6682c9893b8441d2e09df40cea80e2.png',
      zipCode: true,
      allowRememberMe: false,
      billingAddress: true,
      locale: locale,
      closed: () => {
        if (formClosable) {
          this.setState({
            submitting: NOT_SUBMITTING
          });
        }
      },
      token: function(response) {
        formClosable = false;
        var checkoutProps = {
          frequency: props.frequency,
          amount: amount,
          stripeToken: response.id,
          currency: currency,
          locale: locale,
          email: response.email,
          code: response.card.address_zip,
          description: description
        };

        checkoutProps.country = response.card.address_country;
        checkoutProps.address = response.card.address_line1;
        checkoutProps.city = response.card.address_city;
        checkoutProps.first = response.card.name;

        submit("/api/stripe-checkout", checkoutProps, success, function(response) {
          if (response.stripe) {
            error(response.stripe.rawType);
          } else {
            error(response.error);
          }
        });
      }
    });

    // Open Checkout with further options
    handler.open({
      name: appName || this.context.intl.formatMessage({id: "mozilla_foundation"}),
      description: handlerDesc,
      currency: currency,
      // Stripe wants cents.
      amount: amountModifier.stripe(amount, currency)
    });
  }
};

module.exports = StripeMixin;
