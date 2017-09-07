import React from 'react';
import reactGA from 'react-ga';
import submit from '../lib/submit';

var NOT_SUBMITTING = 0;
var SIGNUP_SUBMITTING = 1;

var SignupMixin = {
  contextTypes: {
    intl: React.PropTypes.object
  },
  doSignupSuccess: function(result, location) {
    reactGA.event({
      category: "Signup",
      action: "Submitted the form",
      label: "donate"
    });
    var page = '/' + this.context.intl.locale + location;
    window.location = page;
  },
  signupError: function(result) {
    this.setState({
      submitting: NOT_SUBMITTING,
      signupError: this.context.intl.formatMessage({id: 'try_again_later'})
    });
  },
  doSignup: function(url, props, success, error) {
    this.setState({
      submitting: SIGNUP_SUBMITTING,
      signupError: ""
    });
    props.locale = this.context.intl.locale;
    submit(url, props, success, error);
  }
};

module.exports = SignupMixin;
