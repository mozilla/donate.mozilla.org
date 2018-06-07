import React from 'react';
import amountModifier from '../lib/amount-modifier';
import submit from '../lib/submit';
import reactGA from 'react-ga';

var NOT_SUBMITTING = 0;
var STRIPE_SUBMITTING = 2;

function doStripeSuccess(data, locale, location, subscribed) {
  var transactionId = data.id;
  var amount;
  var currency;
  var email = data.email || "";
  var country = data.country || "";
  var donationFrequency = data.frequency;

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

  var params = '?payment=Stripe&str_amount=' + amount + '&str_currency=' + currency + '&str_id=' + transactionId + '&str_frequency=' + donationFrequency;

  if (email) {
    params += "&email=" + encodeURIComponent(email);
  }
  if (country) {
    params += "&country=" + country;
  }
  if (subscribed === "1") {
    params += "&subscribed=1";
  }
  var page = '/' + locale + '/' + location + '/';
  window.location = page + params;
}

var StripeMixin = {
  contextTypes: {
    intl: React.PropTypes.object
  },
  stripeSuccess: function(data) {
    doStripeSuccess(data, this.context.intl.locale, "thank-you", this.props.subscribed);
  },
  thunderbirdStripeSuccess: function(data) {
    doStripeSuccess(data, this.context.intl.locale, "thunderbird/thank-you");
  },
  componentDidMount: function() {
    this.setupRecaptcha();
  },
  getInitialState: function() {
    return {
      checkoutPropsEmail: "",
      checkoutPropsCode: "",
      checkoutPropsDescription: "",
      checkoutPropsCountry: "",
      checkoutPropsAddress: "",
      checkoutPropsCity: "",
      checkoutPropsFirst: "",
      stripeToken: ""
    };
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
  expectRecaptcha: function(callback) {
    if (typeof window === "undefined") {
      return;
    }
    if (!window.grecaptcha) {
      return setTimeout(() => {
        this.expectRecaptcha(callback);
      }, 100);
    }

    window.grecaptcha.ready(callback);
  },
  setupRecaptcha: function() {
    if (process.env.RECAPTCHA_DISABLED) {
      return;
    }
    this.expectRecaptcha(() => {
      window.grecaptcha.render('g-recaptcha', {
        'sitekey' : process.env.RECAPTCHA_PUBLIC_KEY,
        'size': 'invisible',
        'callback': this.stripeSubmit
      });
    });
  },
  executeRecaptcha: function() {
    if (process.env.RECAPTCHA_DISABLED) {
      return this.stripeSubmit();
    }

    // This is a hack to get around the reCaptcha
    // puzzle being shown at the top of the page.
    window.scrollTo(0, 0);
    this.expectRecaptcha(window.grecaptcha.execute);
  },
  stripeSubmit: function(reCaptchaToken) {
    var success = this.stripeSuccess;
    var error = this.stripeError;
    var appName = this.props.appName;

    if (appName === "thunderbird") {
      success = this.thunderbirdStripeSuccess;
    }

    var checkoutProps = {
      frequency: this.props.frequency,
      amount: this.props.amount,
      currency: this.props.currency.code,
      locale: this.context.intl.locale,
      donation_url: window.location.href,
      email: this.state.checkoutPropsEmail,
      code: this.state.checkoutPropsCode,
      description: this.state.checkoutPropsDescription,
      stripeToken: this.state.stripeToken,
      country: this.state.checkoutPropsCountry,
      address: this.state.checkoutPropsAddress,
      city: this.state.checkoutPropsCity,
      first: this.state.checkoutPropsFirst
    };

    checkoutProps.reCaptchaToken = reCaptchaToken || "";
    submit("/api/stripe-checkout", checkoutProps, success, function(response) {
      if (response.stripe) {
        error(response.stripe.rawType);
      } else {
        error(response.error);
      }
    });
  },
  stripeCheckout: function() {
    var description = this.context.intl.formatMessage({id: "mozilla_donation"});
    var handlerDesc = this.context.intl.formatMessage({id: "donate_now"});
    var appName = this.props.appName;
    var currency = this.props.currency.code;
    var amount = this.props.amount;

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
    } else if (appName === "glassroomnyc") {
      description = "glassroomnyc";
    }
    if (this.props.frequency === "monthly") {
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
      locale: this.context.intl.locale,
      closed: () => {
        if (formClosable) {
          this.setState({
            submitting: NOT_SUBMITTING
          });
        }
      },
      token: (response) => {
        formClosable = false;
        this.setState({
          checkoutPropsEmail: response.email,
          checkoutPropsCode: response.card.address_zip,
          checkoutPropsDescription: description,
          stripeToken: response.id,
          checkoutPropsCountry: response.card.address_country,
          checkoutPropsAddress: response.card.address_line1,
          checkoutPropsCity: response.card.address_city,
          checkoutPropsFirst: response.card.name
        }, this.executeRecaptcha);
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
