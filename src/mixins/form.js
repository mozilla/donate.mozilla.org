import React from 'react';
import reactGA from 'react-ga';
import amountModifier from '../lib/amount-modifier';
import listener from '../lib/listener.js';
import form from '../lib/form.js';

module.exports = {
  contextTypes: {
    intl: React.PropTypes.object,
    router: React.PropTypes.object.isRequired
  },
  propTypes: {
    currency: React.PropTypes.object,
    presets: React.PropTypes.array,
    amount: React.PropTypes.string,
    frequency: React.PropTypes.string
  },
  getInitialState: function() {
    return {
      paymentType: "",
      submitting: false,
      currency: this.props.currency,
      frequency: this.props.frequency || "",
      amount: ""
    };
  },
  componentDidMount: function() {
    form.updateState("currency", this.state.currency);
    form.updateState("presets", this.props.presets);
    form.updateField("amount", this.props.amount);
    form.updateField("frequency", this.props.frequency);

    listener.on("fieldUpdated", this.onFieldUpdated);
    listener.on("stateUpdated", this.onStateUpdated);
  },
  componentWillUnmount: function() {
    listener.off("stateUpdated", this.onStateUpdated);
    listener.off("fieldUpdated", this.onFieldUpdated);
  },
  onFieldUpdated: function(e) {
    var detail = e.detail;
    var field = detail.field;
    var value = detail.value;
    if (field === "frequency") {
      this.setState({
        frequency: value
      });
    }
    if (field === "amount") {
      this.setState({
        amount: value
      });
    }
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
  submit: function(action, props, success, error) {
    props.locale = this.context.intl.locale;
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

    location = location || "thank-you";
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
    var page = '/' + this.context.intl.locale + '/' + location + '/';
    reactGA.pageview(page);
    this.context.router.push(page + params);
  },
  stripeError: function(error) {
    form.error("other", this.context.intl.formatMessage({id: 'try_again_later'}) + " [" + error + "]");
    this.setState({
      submitting: false
    });
  },
  stripeCheckout: function(validate, props) {
    var submit = this.submit;
    var success = this.stripeSuccess;
    var error = this.stripeError;
    var valid = form.validate(validate);
    var description = this.context.intl.formatMessage({id: "mozilla_donation"});
    var handlerDesc = this.context.intl.formatMessage({id: "donate_now"});
    var appName = this.props.appName;
    var submitProps= {};
    if (!valid || this.state.submitting) {
      return;
    }
    this.setState({
      submitting: true
    });

    submitProps = form.buildProps(props);
    if (appName === "thunderbird") {
      description = "Thunderbird";
      success = this.thunderbirdStripeSuccess;
    }
    if (submitProps.frequency === "monthly") {
      description = this.context.intl.formatMessage({id: "mozilla_monthly_donation"});
      handlerDesc = this.context.intl.formatMessage({id: "donate_monthly"});
      if (appName === "thunderbird") {
        description = "Thunderbird monthly";
      }
    }

    var locale = this.context.intl.locale;
    var currency = this.state.currency && this.state.currency.code;
    var handler = StripeCheckout.configure({
      // Need to get this from .env
      key: process.env.STRIPE_PUBLIC_KEY,
      image: process.env.APPLICATION_URI + '/assets/images/mozilla-circular.911f4f7f4e6682c9893b8441d2e09df40cea80e2.png',
      zipCode: true,
      billingAddress: true,
      locale: locale,
      closed: () => {
        this.setState({
          submitting: false
        });
      },
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
      amount: amountModifier.stripe(submitProps.amount, currency)
    });
  },
  paypal: function(validate, props) {
    var valid = form.validate(validate);
    var submitProps = {};
    var description = this.context.intl.formatMessage({id: "mozilla_donation"});
    var appName = this.props.appName;
    if (valid) {
      this.setState({
        submitting: true
      });
      submitProps = form.buildProps(props);

      if (appName === "thunderbird") {
        description = "Thunderbird";
      }
      if (submitProps.frequency === "monthly") {
        description = this.context.intl.formatMessage({id: "mozilla_monthly_donation"});
        if (appName === "thunderbird") {
          description = "Thunderbird monthly";
        }
      }
      submitProps.description = description;
      submitProps.appName = appName;
      this.submit("/api/paypal", submitProps, function(json) {
        window.location = json.endpoint + "/cgi-bin/webscr?cmd=_express-checkout&useraction=commit&token=" + json.token;
      });
    }
  },
  doSignupSuccess: function(result, location) {
    this.setState({
      submitting: false
    });
    var page = '/' + this.context.intl.locale + location;
    reactGA.pageview(page);
    this.context.router.push(page);
  },
  signupSuccess: function(result) {
    this.doSignupSuccess(result, '/share/');
  },
  thundebirdSignupSuccess: function(result) {
    this.doSignupSuccess(result, '/thunderbird/share/');
  },
  signupError: function(result) {
    this.setState({
      submitting: false
    });
    form.error("other", this.context.intl.formatMessage({id: 'try_again_later'}));
  },
  doSignup: function(url, validate, props, success, error) {
    var valid = form.validate(validate);
    var submitProps = {};
    if (valid) {
      this.setState({
        submitting: true
      });
      submitProps = form.buildProps(props);
      this.submit(url, submitProps, success, error);
    }
  },
  signup: function(validate, props) {
    this.doSignup("/api/signup/basket", validate, props, this.signupSuccess, this.signupError);
  },
  mailchimp: function(validate, props) {
    this.doSignup("/api/signup/mailchimp", validate, props, this.thundebirdSignupSuccess, this.signupError);
  }
};
