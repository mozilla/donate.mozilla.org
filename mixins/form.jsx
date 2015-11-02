import assign from 'react/lib/Object.assign';
import reactGA from 'react-ga';
import {Navigation} from 'react-router';
import dispatcher from '../scripts/dispatcher.js';

module.exports = {
  mixins: [Navigation],
  getInitialState: function() {
    return {
      paymentType: "",
      submitting: false,
      presets: this.props.presets,
      currency: this.props.currency,
      props: {
        amount:  this.props.amount,
        frequency: this.props.frequency,
        country: "US",
        province: "",
        city: "",
        address: "",
        code: ""
      },
      values: {},
      errors: {
        creditCardInfo: {
          page: 0,
          cardNumber: "",
          cvc: "",
          expMonth: "",
          expYear: ""
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
    dispatcher.on("currencyChange", this.onCurrencyChanged);
  },
  onCurrencyChanged: function(detail) {
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
  updateHeight: function() {
    if (this.state.activePage !== 0 && !this.state.activePage) {
      return;
    }
    var self = this;
    window.setTimeout(function() {
      var activePage = document.querySelector(".page-active");
      self.setState({
        height: activePage.offsetHeight + "px"
      });
    });
  },
  onChange: function(name, element, field) {
    var newState = {};
    newState.errors = this.state.errors;
    newState[name] = element;
    if (field && this.state.errors[name] && this.state.errors[name][field]) {
      newState.errors[name][field] = "";
    }
    if (field && this.state.errors[field] && this.state.errors[field].message) {
      newState.errors[field].message = "";
    }
    this.setState(newState);
    this.updateHeight();
  },
  updateFormField: function(name, element, field, value) {
    this.onChange(name, element, field);
    var newProps = this.state.props;
    var newValues = this.state.values;
    newProps[field] = value;
    newValues[name] = field;
    this.setState({
      props: newProps,
      values: newValues
    });
  },
  onFrequencyChange: function(name, element, frequency) {
    if (frequency && this.state.props.frequency !== frequency) {
      this.setState({
        presets: this.state.currency.presets[frequency]
      });
    }
    this.updateFormField(name, element, "frequency", frequency);
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
    this.updateHeight();
    return valid;
  },
  nextPage: function(validate) {
    var valid = this.validateProps(validate);
    if (valid) {
      this.toThisPage(this.state.activePage+1);
    }
  },
  toThisPage: function(index) {
    this.setState({
      activePage: index
    });

    // Index starts at 0, and our page tracking starts at 1.
    var page = index+1;
    // Build the page the way it is expected.
    var currentPage = window.location.pathname + "#page-" + page;
    // These are virtual pageviews, so we track them manually in GA
    reactGA.pageview(currentPage);
    this.updateHeight();
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
    }

    var params = '?payment=Stripe&str_amount=' + amount + '&str_currency=' + currency + '&str_id=' +transactionId + '&str_frequency=' + donationFrequency;

    this.transitionTo('/' + this.props.locales[0] + '/' + location + '/?' + params);
  },
  stripeError: function(errorCode, errorType) {
    var newState = {};
    var cardErrorCodes = {
      "invalid_number": {
        name: "creditCardInfo",
        field: "cardNumber",
        message: this.getIntlMessage('invalid_number')
      },
      "invalid_expiry_month": {
        name: "creditCardInfo",
        field: "expMonth",
        message: this.getIntlMessage('invalid_expiry_month')
      },
      "invalid_expiry_year": {
        name: "creditCardInfo",
        field: "expYear",
        message: this.getIntlMessage('invalid_expiry_year')
      },
      "invalid_cvc": {
        name: "creditCardInfo",
        field: "cvc",
        message: this.getIntlMessage('invalid_CVC')
      },
      "incorrect_number": {
        name: "creditCardInfo",
        field: "cardNumber",
        message: this.getIntlMessage('incorrect_number')
      },
      "expired_card": {
        name: "creditCardInfo",
        field: "cardNumber",
        message: this.getIntlMessage('expired_card')
      },
      "incorrect_cvc": {
        name: "creditCardInfo",
        field: "cvc",
        message: this.getIntlMessage('incorrect_CVC')
      },
      "incorrect_zip": {
        name: "code",
        field: "message",
        message: this.getIntlMessage('invalid_zip')
      },
      "card_declined": {
        name: "creditCardInfo",
        field: "cardNumber",
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
    this.updateHeight();
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
    this.setState({
      submitting: true
    });
    submitProps = this.buildProps(props);
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
          first: submitProps.first,
          last: submitProps.last,
          country: submitProps.country,
          address: submitProps.address,
          city: submitProps.city,
          code: submitProps.code,
          province: submitProps.province,
          locale: submitProps.locale,
          signup: submitProps.signup
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
    submitProps = this.buildProps(props);
    var locale = this.props.locales[0];
    var currency = this.state.currency && this.state.currency.code;
    var handler = StripeCheckout.configure({
      // Need to get this from .env
      key: process.env.STRIPE_PUBLIC_KEY,
      image: '',
      token: function(response) {
        // Where is this things error? Maybe it's not called at all for an error case.
        submit("/api/stripe-checkout", {
          frequency: submitProps.frequency,
          amount: submitProps.amount,
          stripeToken: response.id,
          currency: currency,
          locale: locale
        }, success);
      }
    });

    // Open Checkout with further options
    handler.open({
      name: this.getIntlMessage("mozilla_donation"),
      description: submitProps.description,
      // Stripe wants cents.
      amount: submitProps.amount * 100
    });
  },
  buildProps: function(fields) {
    var self = this;
    var props = {};
    fields.forEach(function(name) {
      var state = self.state[name].state;
      var prop;
      // Currently some fields expose their values on the form, and not themselves.
      // So we need to check for props in both places until all field componenets are updated.
      if (state) {
        prop = state.values;
      }
      if (!prop) {
        prop = {
          [self.state.values[name]]: self.state.props[self.state.values[name]]
        };
      }
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
