import React from 'react';
import submit from '../lib/submit';

var NOT_SUBMITTING = 0;
var PAYPAL_SUBMITTING = 3;

var PaypalMixin = {
  contextTypes: {
    intl: React.PropTypes.object
  },
  paypal: function() {
    var props = {
      frequency: this.props.frequency,
      amount: this.props.amount,
      appName: this.props.appName,
      currency: this.props.currency.code
    };
    var description = this.context.intl.formatMessage({id: "mozilla_donation"});
    var appName = props.appName;

    if (this.state.submitting !== NOT_SUBMITTING) {
      return;
    }

    this.setState({
      submitting: PAYPAL_SUBMITTING
    });

    if (appName === "thunderbird") {
      description = "Thunderbird";
    } else if (appName === "glassroomnyc") {
      description = "glassroomnyc";
    }
    if (props.frequency === "monthly") {
      description = this.context.intl.formatMessage({id: "mozilla_monthly_donation"});
      if (appName === "thunderbird") {
        description = "Thunderbird monthly";
      } else if (appName === "glassroomnyc") {
        description = "glassroomnyc monthly";
      }
    }
    props.description = description;
    props.appName = appName || "mozillafoundation";
    props.locale = this.context.intl.locale;
    props.donation_url = window.location.href;
    submit("/api/paypal", props, function(json) {
      window.location = json.endpoint + "/cgi-bin/webscr?cmd=_express-checkout&useraction=commit&token=" + json.token;
    });
  }
};

module.exports = PaypalMixin;
