import assign from 'react/lib/Object.assign';
import reactGA from 'react-ga';
import {Navigation} from 'react-router';
import listener from '../scripts/listener.js';
import amountModifier from '../scripts/amount-modifier';
import dispatcher from '../scripts/dispatcher.js';

module.exports = {
  mixins: [Navigation],
  getInitialState: function() {
    return {
      paymentType: "",
      submitting: false,
      presets: this.props.presets,
      currency: this.props.currency,
      showCvcHint: false,
      props: {
        amount:  this.props.amount,
        frequency: this.props.frequency,
        country: "US",
        province: "",
        city: "",
        address: "",
        code: "",
        firstName: "",
        LastName: "",
        cardNumber: "",
        cvc: "",
        expMonth: "",
        expYear: "",
        email: "",
        signup: false,
        privacyPolicy: false
      },
      values: {},
      errors: {
        cardNumber: {
          page: 0,
          message: ""
        },
        cvc: {
          page: 0,
          message: ""
        },
        expMonth: {
          page: 0,
          message: ""
        },
        expYear: {
          page: 0,
          message: ""
        },
        code: {
          page: 0,
          message: ""
        },
        other: {
          page: 0,
          message: ""
        }
      }
    };
  },
  componentDidMount: function() {
    this.onHeightChange();
    listener.on("currencyChange", this.onCurrencyChange);
    listener.on("heightChange", this.onHeightChange);
    listener.on("fieldChange", this.onFieldChange);
    listener.on("fieldReady", this.onFieldReady);
    listener.on("frequencyChange", this.onFrequencyChange);
    listener.on("toggleCvcHint", this.onToggleCvcHint);
    listener.on("toPage", this.toThisPage);
    listener.on("nextPage", this.nextPage);
  },
  componentWillUnmount: function() {
    listener.off("currencyChange", this.onCurrencyChange);
    listener.off("heightChange", this.onHeightChange);
    listener.off("fieldChange", this.onFieldChange);
    listener.off("fieldReady", this.onFieldReady);
    listener.off("frequencyChange", this.onFrequencyChange);
    listener.off("toggleCvcHint", this.onToggleCvcHint);
    listener.off("toPage", this.toThisPage);
    listener.off("nextPage", this.nextPage);
  },
  onCurrencyChange: function(e) {
    var detail = e.detail;
    var value = detail.value;
    var currencies = this.props.currencies;
    var currency = currencies[value] || this.state.currency;
    var presets = currency.presets[this.state.props.frequency];
    var newProps = this.state.props;
    newProps.amount = "";
    this.setState({
      presets: presets,
      currency: currency,
      props: newProps
    });
  },
  onToggleCvcHint: function() {
    this.setState({
      showCvcHint: !this.state.showCvcHint
    });
  },
  onHeightChange: function() {
    if (this.state.activePage !== 0 && !this.state.activePage) {
      return;
    }
    var self = this;
    window.setTimeout(function() {
      var activePage = document.querySelector(".page-active");
      if (activePage) {
        self.setState({
          height: activePage.offsetHeight + "px"
        });
      }
    });
  },
  onFieldReady: function(e) {
    var detail = e.detail;
    var element = detail.element;
    var name = detail.name;
    var field = detail.field;
    var newValues = this.state.values;
    var newState = {};

    newState[name] = element;
    newValues[name] = field;
    newState.values = newValues;
    this.setState(newState);
  },
  onFieldChange: function(e) {
    var detail = e.detail;
    var field = detail.field;
    var value = detail.value;
    var newProps = this.state.props;
    var newState = {};

    newState.errors = this.state.errors;
    if (field && this.state.errors[field] && this.state.errors[field].message) {
      newState.errors[field].message = "";
    }
    newProps[field] = value;
    newState.props = newProps;
    this.setState(newState);
  },
  onFrequencyChange: function(e) {
    var detail = e.detail;
    var frequency = detail.frequency;
    if (frequency) {
      this.setState({
        presets: this.state.currency.presets[frequency]
      });
    }
  },
  onPageError: function(errors, index) {
    var stateErrors = this.state.errors;
    errors.forEach(function(error) {
      error.page = index;
    });
    this.setState({
      errors: stateErrors
    });
  },
  validateProps: function(props) {
    var self = this;
    var valid = true;
    props = props || [];
    props.forEach(function(name) {
      if (!self.state[name].validate()) {
        valid = false;
      }
    });
    this.onHeightChange();
    return valid;
  },
  nextPage: function(e) {
    var validate = e.detail.validate;
    var valid = this.validateProps(validate);
    if (valid) {
      dispatcher.fire("toPage", {
        page: this.state.activePage+1
      });
    }
  },
  toThisPage: function(e) {
    var index = e.detail.page;
    this.setState({
      activePage: index
    });

    // Index starts at 0, and our page tracking starts at 1.
    var page = index+1;
    // Build the page the way it is expected.
    var currentPage = window.location.pathname + "#page-" + page;
    // These are virtual pageviews, so we track them manually in GA
    reactGA.pageview(currentPage);
    this.onHeightChange();
  },
  submit: function(action, props, success, error) {
    this.setState({
      submitting: true
    });

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

    this.transitionTo('/' + this.props.locales[0] + '/' + location + '/?' + params);
  },
  stripeError: function(errorCode, errorType) {
    var newState = {};
    var cardErrorCodes = {
      "invalid_number": {
        name: "cardNumber",
        field: "message",
        message: this.getIntlMessage('invalid_number')
      },
      "invalid_expiry_month": {
        name: "expMonth",
        field: "message",
        message: this.getIntlMessage('invalid_expiry_month')
      },
      "invalid_expiry_year": {
        name: "expYear",
        field: "message",
        message: this.getIntlMessage('invalid_expiry_year')
      },
      "invalid_cvc": {
        name: "cvc",
        field: "message",
        message: this.getIntlMessage('invalid_CVC')
      },
      "incorrect_number": {
        name: "cardNumber",
        field: "message",
        message: this.getIntlMessage('incorrect_number')
      },
      "expired_card": {
        name: "cardNumber",
        field: "message",
        message: this.getIntlMessage('expired_card')
      },
      "incorrect_cvc": {
        name: "cvc",
        field: "message",
        message: this.getIntlMessage('incorrect_CVC')
      },
      "incorrect_zip": {
        name: "code",
        field: "message",
        message: this.getIntlMessage('invalid_zip')
      },
      "card_declined": {
        name: "cardNumber",
        field: "message",
        message: this.getIntlMessage('declined_card')
      }
    };

    var cardError = cardErrorCodes[errorCode];
    newState.submitting = false;
    newState.errors = this.state.errors;
    if (errorType === "card_error" && cardError) {
      if (this.state.errors[cardError.name].page < this.state.activePage) {
        newState.activePage = this.state.errors[cardError.name].page;
      }
      newState.errors[cardError.name][cardError.field] = cardError.message;
    } else {
      if (this.state.errors.other.page < this.state.activePage) {
        newState.activePage = this.state.errors.other.page;
      }
      newState.errors.other.message = this.getIntlMessage('try_again_later');
    }
    this.setState(newState);
    this.onHeightChange();
  },
  stripe: function(validate, props) {
    var submit = this.submit;
    var success = this.stripeSuccess;
    var error = this.stripeError;
    var valid = this.validateProps(validate);
    var submitProps = {};
    if (!valid) {
      return;
    }
    var description = this.getIntlMessage("mozilla_donation");
    this.setState({
      submitting: true
    });
    submitProps = this.buildProps(props);
    if (submitProps.frequency === "monthly") {
      description = this.getIntlMessage("mozilla_monthly_donation");
    }
    Stripe.setPublishableKey(process.env.STRIPE_PUBLIC_KEY);
    Stripe.card.createToken({
      number: submitProps.cardNumber,
      cvc: submitProps.cvc,
      exp_month: submitProps.expMonth,
      exp_year: submitProps.expYear
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
  stripeCheckout: function(validate, props) {
    var submit = this.submit;
    var success = this.stripeSuccess;
    var valid = this.validateProps(validate);
    var submitProps= {};
    if (!valid) {
      return;
    }
    var description = this.getIntlMessage("mozilla_donation");
    var handlerDesc = "";
    submitProps = this.buildProps(props);
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
      billingAddress: true,
      locale: locale,
      token: function(response) {
        // Where is this things error? Maybe it's not called at all for an error case.
        submit("/api/stripe-checkout", {
          frequency: submitProps.frequency,
          amount: submitProps.amount,
          stripeToken: response.id,
          currency: currency,
          locale: submitProps.locale,
          email: response.email,
          first: response.card.name,
          country: response.card.address_country,
          address: response.card.address_line1,
          city: response.card.address_city,
          code: response.card.address_zip,
          description: description
        }, success);
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
  buildProps: function(fields) {
    var state = this.state;
    var props = {};
    fields.forEach(function(name) {
      var prop = {
        [state.values[name]]: state.props[state.values[name]]
      };
      // Modify props to now contain the values in prop.
      assign(props, prop);
    });
    return props;
  },
  paypal: function(validate, props) {
    var valid = this.validateProps(validate);
    var submitProps = {};
    var description = this.getIntlMessage("mozilla_donation");
    if (valid) {
      submitProps = this.buildProps(props);
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
    this.transitionTo('/' + this.props.locales[0] + '/share/');
  },
  signupError: function(result) {
    this.setState({
      submitting: false
    });
    this.setState({
      errors: {
        other: {
          message: this.getIntlMessage('try_again_later')
        }
      }
    });
  },
  signup: function(validate, props) {
    var valid = this.validateProps(validate);
    var submitProps = {};
    if (valid) {
      submitProps = this.buildProps(props);
      this.submit("/api/signup", submitProps, this.signupSuccess, this.signupError);
    }
  }
};
