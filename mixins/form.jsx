import React from 'react';
import reactGA from 'react-ga';
import amountModifier from '../scripts/amount-modifier';
import listener from '../scripts/listener.js';
import dispatcher from '../scripts/dispatcher.js';
import form from '../scripts/form.js';

module.exports = {
  propTypes: {
    currency: React.PropTypes.object,
    presets: React.PropTypes.array,
    amount: React.PropTypes.string,
    frequency: React.PropTypes.string,
    country: React.PropTypes.string.isRequired
  },
  contextTypes: {
    router: React.PropTypes.object,
    intl: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      paymentType: "",
      submitting: false,
      showCvcHint: false,
      currency: this.props.currency,
      frequency: this.props.frequency || "",
      amount: "",
      thunderbird: false
    };
  },
  componentDidMount: function() {
    form.updateState("currency", this.state.currency);
    form.updateState("presets", this.props.presets);
    form.updateField("amount", this.props.amount);
    form.updateField("frequency", this.props.frequency);
    form.updateField("country", this.props.country);

    listener.on("fieldUpdated", this.onFieldUpdated);
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
    var transactionId = data.id;
    var amount;
    var currency;
    var email = data.email;
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

    var params = 'payment=Stripe&str_amount=' + amount + '&str_currency=' + currency + '&str_id=' +transactionId + '&str_frequency=' + donationFrequency;

    if (email) {
      params += "&email=" + email;
    }
    if (country) {
      params += "&country=" + country;
    }
    if (this.state.thunderbird) {
      location = `thunderbird/${location}`;
    }
    var page = `/${this.context.intl.locale}/${location}/`;
    reactGA.pageview(page);
    this.context.router.push(`${page}?${params}`);
  },
  stripeError: function(errorCode, errorType) {
    var cardErrorCodes = {
      "invalid_number": {
        field: "cardNumber",
        message: this.context.intl.formatMessage({id: 'invalid_number'})
      },
      "invalid_expiry_month": {
        field: "expMonth",
        message: this.context.intl.formatMessage({id: 'invalid_expiry_month'})
      },
      "invalid_expiry_year": {
        field: "expYear",
        message: this.context.intl.formatMessage({id: 'invalid_expiry_year'})
      },
      "invalid_cvc": {
        field: "cvc",
        message: this.context.intl.formatMessage({id: 'invalid_CVC'})
      },
      "incorrect_number": {
        field: "cardNumber",
        message: this.context.intl.formatMessage({id: 'incorrect_number'})
      },
      "expired_card": {
        field: "cardNumber",
        message: this.context.intl.formatMessage({id: 'expired_card'})
      },
      "incorrect_cvc": {
        field: "cvc",
        message: this.context.intl.formatMessage({id: 'incorrect_CVC'})
      },
      "incorrect_zip": {
        field: "code",
        message: this.context.intl.formatMessage({id: 'invalid_zip'})
      },
      "card_declined": {
        field: "cardNumber",
        message: this.context.intl.formatMessage({id: 'declined_card'})
      },
      "processing_error": {
        field: "cardNumber",
        message: this.context.intl.formatMessage({id: 'transaction_try_another'})
      }
    };

    var cardError = cardErrorCodes[errorCode];
    if (errorType === "card_error" && cardError) {
      form.error(cardError.field, cardError.message);
    } else {
      form.error("other", this.context.intl.formatMessage({id: 'try_again_later'}) + " [" + errorType + "]");
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
    var description = this.context.intl.formatMessage({id: "mozilla_donation"});
    this.setState({
      submitting: true
    });
    submitProps = form.buildProps(props);
    if (submitProps.frequency === "monthly") {
      description = this.context.intl.formatMessage({id: "mozilla_monthly_donation"});
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
  stripeCheckout: function(validate, props, billingAddress, appName) {
    var submit = this.submit;
    var success = this.stripeSuccess;
    var error = this.stripeError;
    var valid = form.validate(validate);
    var description = this.context.intl.formatMessage({id: "mozilla_donation"});
    var handlerDesc = this.context.intl.formatMessage({id: "donate_now"});
    var submitProps= {};
    if (!valid || this.state.submitting) {
      return;
    }
    this.setState({
      submitting: true
    });

    submitProps = form.buildProps(props);
    if (appName === "thunderbird") {
      this.setState({thunderbird: true});
      description = "Thunderbird";
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
      billingAddress: billingAddress,
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
      name: appName || this.context.intl.formatMessage({id: "mozilla_foundation"}),
      description: handlerDesc,
      currency: currency,
      // Stripe wants cents.
      amount: amountModifier.stripe(submitProps.amount, currency)
    });
  },
  paypal: function(validate, props, appName) {
    var valid = form.validate(validate);
    var submitProps = {};
    var description = this.context.intl.formatMessage({id: "mozilla_donation"});
    if (valid) {
      this.setState({
        submitting: true
      });
      submitProps = form.buildProps(props);

      if (appName === "thunderbird") {
        this.setState({thunderbird: true});
        description = "Thunderbird";
      }
      if (submitProps.frequency === "monthly") {
        description = this.context.intl.formatMessage({id: "mozilla_monthly_donation"});
        if (appName === "thunderbird") {
          description = "Thunderbird monthly";
        }
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
    var page = '/' + this.context.intl.locale + '/share/';
    reactGA.pageview(page);
    this.context.router.push(page);
  },
  signupError: function(result) {
    this.setState({
      submitting: false
    });
    form.error("other", this.context.intl.formatMessage({id: 'try_again_later'}));
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
