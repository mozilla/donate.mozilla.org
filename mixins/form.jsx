import React from 'react';
import reactGA from 'react-ga';
import {Navigation} from 'react-router';
import amountModifier from '../scripts/amount-modifier';
import listener from '../scripts/listener.js';
import dispatcher from '../scripts/dispatcher.js';
import form from '../scripts/form.js';

module.exports = {
  mixins: [Navigation],
  propTypes: {
    currency: React.PropTypes.object,
    presets: React.PropTypes.array,
    amount: React.PropTypes.string,
    frequency: React.PropTypes.string,
    country: React.PropTypes.string.isRequired,
    locales: React.PropTypes.array.isRequired
  },
  getInitialState: function() {
    return {
      paymentType: "",
      submitting: false,
      showCvcHint: false,
      currency: this.props.currency
    };
  },
  componentDidMount: function() {
    form.updateState("currency", this.state.currency);
    form.updateState("presets", this.props.presets);
    form.updateField("amount", this.props.amount);
    form.updateField("frequency", this.props.frequency);
    form.updateField("country", this.props.country);

    listener.on("stateUpdated", this.onStateUpdated);
    listener.on("toggleCvcHint", this.onToggleCvcHint);
    listener.on("toPage", this.toThisPage);
    listener.on("nextPage", this.nextPage);
  },
  componentWillUnmount: function() {
    listener.off("stateUpdated", this.onStateUpdated);
    listener.off("toggleCvcHint", this.onToggleCvcHint);
    listener.off("toPage", this.toThisPage);
    listener.off("nextPage", this.nextPage);
  },
  onStateUpdated: function(e) {
    var detail = e.detail;
    var state = detail.state;
    var value = detail.value;
    if (state === "currency") {
      this.setState({
        currency: value
      });
    }
  },
  onToggleCvcHint: function() {
    this.setState({
      showCvcHint: !this.state.showCvcHint
    });
  },
  nextPage: function(e) {
    dispatcher.fire("toPage", {
      page: this.state.activePage+1
    });
  },
  toThisPage: function(e) {
    var index = e.detail.page;
    if (this.state.activePage === index) {
      return;
    }
    this.setState({
      activePage: index
    });

    // Index starts at 0, and our page tracking starts at 1.
    var page = index+1;
    // Build the page the way it is expected.
    var currentPage = window.location.pathname + "#page-" + page;
    // These are virtual pageviews, so we track them manually in GA
    reactGA.pageview(currentPage);
  },
  submit: function(action, props, success, error) {
    props.locale = this.props.locales[0];
    var currency = this.state.currency;
    if (currency) {
      props.currency = currency.code;
    }

    fetch(action, {
      method: 'post',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(props)
    }).then(function(response) {
      var responseContent;
      var callback = success;
      if (!response.headers.get("content-type")) {
        responseContent = response.text();
      } else {
        responseContent = response.json();
      }
      if (!response.ok) {
        callback = error;
      }
      responseContent.then(function(result) {
        if (callback) {
          callback(result);
        }
      });
    });
  },
  stripeSuccess: function(data) {
    var transactionId = data.id;
    var amount;
    var currency;
    var email = data.email || "";
    var country = data.country || "";
    var donationFrequency = data.frequency;
    this.setState({
      submitting: false
    });
    if (donationFrequency === "monthly") {
      currency = data.currency;
      // Stripe plans are a multiple of the currencies equivilent of Cents
      // e.g. £5/month = 500 £0.01 subscriptions
      amount = data.quantity;
    } else {
      amount = data.amount;
      currency = data.currency;
    }

    var location = "thank-you";
    // If we are already signed up, send to share.
    if (data.signup) {
      location = "share";
      email = "";
      country = "";
    }

    var params = '?payment=Stripe&str_amount=' + amount + '&str_currency=' + currency + '&str_id=' +transactionId + '&str_frequency=' + donationFrequency;

    if (email) {
      params += "&email=" + email;
    }
    if (country) {
      params += "&country=" + country;
    }
    var page = '/' + this.props.locales[0] + '/' + location + '/';
    reactGA.pageview(page);
    this.transitionTo(page + '?' + params);
  },
  stripeError: function(errorCode, errorType) {
    var cardErrorCodes = {
      "invalid_number": {
        field: "cardNumber",
        message: this.getIntlMessage('invalid_number')
      },
      "invalid_expiry_month": {
        field: "expMonth",
        message: this.getIntlMessage('invalid_expiry_month')
      },
      "invalid_expiry_year": {
        field: "expYear",
        message: this.getIntlMessage('invalid_expiry_year')
      },
      "invalid_cvc": {
        field: "cvc",
        message: this.getIntlMessage('invalid_CVC')
      },
      "incorrect_number": {
        field: "cardNumber",
        message: this.getIntlMessage('incorrect_number')
      },
      "expired_card": {
        field: "cardNumber",
        message: this.getIntlMessage('expired_card')
      },
      "incorrect_cvc": {
        field: "cvc",
        message: this.getIntlMessage('incorrect_CVC')
      },
      "incorrect_zip": {
        field: "code",
        message: this.getIntlMessage('invalid_zip')
      },
      "card_declined": {
        field: "cardNumber",
        message: this.getIntlMessage('declined_card')
      },
      "processing_error": {
        field: "cardNumber",
        message: this.getIntlMessage('transaction_try_another')
      }
    };

    var cardError = cardErrorCodes[errorCode];
    if (errorType === "card_error" && cardError) {
      form.error(cardError.field, cardError.message);
    } else {
      form.error("other", this.getIntlMessage('try_again_later') + " [" + errorType + "]");
    }
    this.setState({
      submitting: false
    });
  },
  stripe: function(validate, props) {
    var submit = this.submit;
    var success = this.stripeSuccess;
    var error = this.stripeError;
    var valid = form.validate(validate);
    var submitProps = {};
    if (!valid || this.state.submitting) {
      return;
    }
    var description = this.getIntlMessage("mozilla_donation");
    this.setState({
      submitting: true
    });
    submitProps = form.buildProps(props);
    if (submitProps.frequency === "monthly") {
      description = this.getIntlMessage("mozilla_monthly_donation");
    }
    Stripe.setPublishableKey(process.env.STRIPE_PUBLIC_KEY);
    Stripe.card.createToken({
      number: submitProps.cardNumber,
      cvc: submitProps.cvc,
      exp_month: submitProps.expMonth,
      exp_year: submitProps.expYear,
      address_city: submitProps.city,
      address_country: submitProps.country,
      address_line1: submitProps.address,
      address_state: submitProps.province,
      address_zip: submitProps.code,
      name: submitProps.firstName + " " + submitProps.lastName
    }, function(status, response) {
      var stripeProps = {};
      if (response.error) {
        error(response.error.code, response.error.type);
      } else {
        stripeProps = {
          currency: submitProps.currency,
          amount: submitProps.amount,
          frequency: submitProps.frequency,
          stripeToken: response.id,
          email: submitProps.email,
          first: submitProps.firstName,
          last: submitProps.lastName,
          country: submitProps.country,
          address: submitProps.address,
          city: submitProps.city,
          code: submitProps.code,
          province: submitProps.province,
          locale: submitProps.locale,
          signup: submitProps.signup,
          description: description
        };
        submit("/api/stripe", stripeProps, success, function(response) {
          if (response.stripe) {
            error(response.stripe.code, response.stripe.rawType);
          } else {
            error(response.statusCode, response.error);
          }
        });
      }
    });
  },
  stripeCheckout: function(validate, props, billingAddress) {
    var submit = this.submit;
    var success = this.stripeSuccess;
    var error = this.stripeError;
    var valid = form.validate(validate);
    var submitProps= {};
    if (!valid) {
      return;
    }
    var description = this.getIntlMessage("mozilla_donation");
    var handlerDesc = "";
    submitProps = form.buildProps(props);
    if (submitProps.frequency === "monthly") {
      description = this.getIntlMessage("mozilla_monthly_donation");
      handlerDesc = this.getIntlMessage("monthly");
    }

    var locale = this.props.locales[0];
    var currency = this.state.currency && this.state.currency.code;
    var handler = StripeCheckout.configure({
      // Need to get this from .env
      key: process.env.STRIPE_PUBLIC_KEY,
      image: '',
      zipCode: true,
      billingAddress: billingAddress,
      locale: locale,
      token: function(response) {
        var checkoutProps = {
          frequency: submitProps.frequency,
          amount: submitProps.amount,
          stripeToken: response.id,
          currency: currency,
          locale: submitProps.locale,
          email: response.email,
          code: response.card.address_zip,
          description: description
        };

        if (billingAddress) {
          checkoutProps.country = response.card.address_country;
          checkoutProps.address = response.card.address_line1;
          checkoutProps.city = response.card.address_city;
          checkoutProps.first = response.card.name;
        }
        submit("/api/stripe-checkout", checkoutProps, success, function(response) {
          if (response.stripe) {
            error(response.stripe.code, response.stripe.rawType);
          } else {
            error(response.statusCode, response.error);
          }
        });
      }
    });

    // Open Checkout with further options
    handler.open({
      name: this.getIntlMessage("mozilla_donation"),
      description: handlerDesc,
      currency: currency,
      // Stripe wants cents.
      amount: amountModifier.stripe(submitProps.amount, currency)
    });
  },
  paypal: function(validate, props) {
    var valid = form.validate(validate);
    var submitProps = {};
    var description = this.getIntlMessage("mozilla_donation");
    if (valid) {
      this.setState({
        submitting: true
      });
      submitProps = form.buildProps(props);
      if (submitProps.frequency === "monthly") {
        description = this.getIntlMessage("mozilla_monthly_donation");
      }
      submitProps.description = description;
      this.submit("/api/paypal", submitProps, function(json) {
        window.location = json.endpoint + "/cgi-bin/webscr?cmd=_express-checkout&useraction=commit&token=" + json.token;
      });
    }
  },
  signupSuccess: function(result) {
    this.setState({
      submitting: false
    });
    var page = '/' + this.props.locales[0] + '/share/';
    reactGA.pageview(page);
    this.transitionTo(page);
  },
  signupError: function(result) {
    this.setState({
      submitting: false
    });
    form.error("other", this.getIntlMessage('try_again_later'));
  },
  signup: function(validate, props) {
    var valid = form.validate(validate);
    var submitProps = {};
    if (valid) {
      this.setState({
        submitting: true
      });
      submitProps = form.buildProps(props);
      this.submit("/api/signup", submitProps, this.signupSuccess, this.signupError);
    }
  }
};
