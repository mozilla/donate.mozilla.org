import assign from 'react/lib/Object.assign';
import reactGA from 'react-ga';
import {Navigation} from 'react-router';

module.exports = {
  mixins: [Navigation],
  getInitialState: function() {
    return {
      paymentType: "",
      submitting: false,
      presets: this.props.presets,
      currency: this.props.currency,
      props: {
        amount: {
          values: {
            amount: this.props.amount
          }
        },
        frequency: {
          values: {
            frequency: this.props.frequency
          }
        }
      },
      errors: {
        creditCardInfo: {
          page: 0,
          number: "",
          cvc: "",
          monthExp: "",
          yearExp: ""
        },
        address: {
          page: 0,
          code: ""
        },
        other: {
          page: 0,
          message: ""
        }
      }
    };
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
  onChange: function(name, value, field) {
    var newState = {};
    newState[name] = value;
    if (field && this.state.errors[name] && this.state.errors[name][field]) {
      newState.errors[name][field] = "";
    }
    this.setState(newState);
    this.updateHeight();
  },
  updateFormField: function(name, value, values) {
    this.onChange(name, value);
    if (!values) {
      return;
    }
    var newProps = this.state.props;
    newProps[name].values = values;
    this.setState({
      props: newProps
    });
  },
  onFrequencyChange: function(name, value, values) {
    if (values && this.state.props.frequency.values.frequency !== values.frequency) {
      this.setState({
        presets: this.state.currency.presets[values.frequency]
      });
    }
    this.updateFormField(name, value, values);
  },
  onCurrencyChanged: function(e) {
    var value = e.currentTarget.value;
    var currencies = this.props.currencies;
    var currency = currencies[value] || this.state.currency;
    var presets = currency.presets[this.state.props.frequency.values.frequency];
    var newProps = this.state.props;
    newProps.amount.values.amount = "";
    this.setState({
      presets: presets,
      currency: currency,
      props: newProps
    });
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
  submit: function(action, props, callback) {
    props.locale = this.props.locales[0];
    props.currency = this.props.currency.code;
    fetch(action, {
      method: 'post',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(props)
    }).then(function(response) {
      return response.json();
    }).then(function(json) {
      if (callback) {
        callback(json);
      }
    });
  },
  stripeSuccess: function(data) {
    var transactionId = data.id;
    var amount;
    var currency;
    var donationFrequency;
    this.setState({
      submitting: false
    });
    if (data.plan) {
      donationFrequency = 'monthly';
      currency = data.plan.currency;
      // Stripe plans are a multiple of the currencies equivilent of Cents
      // e.g. £5/month = 500 £0.01 subscriptions
      amount = data.quantity;
    } else {
      donationFrequency = 'one-time';
      amount = data.amount;
      currency = data.currency;
    }

    var params = '?payment=Stripe&str_amount=' + amount + '&str_currency=' + currency + '&str_id=' +transactionId + '&str_frequency=' +donationFrequency;

    this.transitionTo('/' + this.props.locales[0] + '/thank-you/?' + params);
  },
  stripeError: function(error) {
    var newState = {};
    var cardErrorCodes = {
      "invalid_number": {
        name: "creditCardInfo",
        field: "number",
        message: this.getIntlMessage('invalid_number')
      },
      "invalid_expiry_month": {
        name: "creditCardInfo",
        field: "monthExp",
        message: this.getIntlMessage('invalid_expiry_month')
      },
      "invalid_expiry_year": {
        name: "creditCardInfo",
        field: "yearExp",
        message: this.getIntlMessage('invalid_expiry_year')
      },
      "invalid_cvc": {
        name: "creditCardInfo",
        field: "cvc",
        message: this.getIntlMessage('invalid_CVC')
      },
      "incorrect_number": {
        name: "creditCardInfo",
        field: "number",
        message: this.getIntlMessage('incorrect_number')
      },
      "expired_card": {
        name: "creditCardInfo",
        field: "number",
        message: this.getIntlMessage('expired_card')
      },
      "incorrect_cvc": {
        name: "creditCardInfo",
        field: "cvc",
        message: this.getIntlMessage('incorrect_CVC')
      },
      "incorrect_zip": {
        name: "address",
        field: "code",
        message: this.getIntlMessage('invalid_zip')
      },
      "card_declined": {
        name: "creditCardInfo",
        field: "number",
        message: this.getIntlMessage('declined_card')
      }
    };

    var cardError = cardErrorCodes[error.code];
    newState.submitting = false;
    newState.errors = this.state.errors;
    if (error.rawType === "card_error" && cardError) {
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
    Stripe.card.createToken({
      number: submitProps.cardNumber,
      cvc: submitProps.cvc,
      exp_month: submitProps.expMonth,
      exp_year: submitProps.expYear
    }, function(status, response) {
      if (response.error) {
        error(result.error);
      } else {
        submitProps.cardNumber = "";
        submitProps.stripeToken = response.id;
        submit("/api/stripe", submitProps, function(result) {
          if (result.error) {
            error(result.error);
          } else {
            success(result.success);
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
    var handler = StripeCheckout.configure({
      // Need to get this from .env
      key: process.env.STRIPE_PUBLIC_KEY,
      image: '',
      token: function(response) {
        // Where is this things error? Maybe it's not called at all for an error case.
        submitProps.cardNumber = "";
        submitProps.stripeToken = response.id;
        submit("/api/stripe", submitProps, success);
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
        prop = self.state.props[name].values;
      }
      // Modify props to now contain the values in prop.
      assign(props, prop);
    });
    return props;
  },
  paypal: function(validate, props) {
    this.onSubmit("/api/paypal", validate, props, function(json) {
      window.location = json.endpoint + "/cgi-bin/webscr?cmd=_express-checkout&useraction=commit&token=" + json.token;
    });
  },
  signupSuccess: function(result) {
    this.setState({
      submitting: false
    });
    if (result.error) {
      this.setState({
        errors: {
          other: {
            message: this.getIntlMessage('try_again_later')
          }
        }
      });
    } else {
      this.transitionTo('/' + this.props.locales[0] + '/share');
    }
  },
  signup: function(validate, props) {
    this.setState({
      submitting: true
    });
    this.onSubmit("/api/signup", validate, props, this.signupSuccess);
  },
  onSubmit: function(action, validate, props, callback) {
    var valid = this.validateProps(validate);
    var submitProps = {};
    if (valid) {
      submitProps = this.buildProps(props);
      this.submit(action, submitProps, callback);
    }
  }
};
