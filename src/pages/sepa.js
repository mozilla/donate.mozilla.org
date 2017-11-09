import React from 'react';
import MozillaFooter from '../components/mozilla/footer.js';
import Header from '../components/header.js';
import SmallPrint from '../components/small-print.js';

import {
  StripeProvider,
  Elements,
  CardElement,
  injectStripe
}
from 'react-stripe-elements-universal';

import Script from 'react-load-script'

class CardSection extends React.Component {
  render() {
    return (
      <label>
        Card details
        <CardElement style={{base: {fontSize: '18px'}}} />
      </label>
    );
  }
};

class CheckoutForm extends React.Component {
  handleSubmit(ev) {
    ev.preventDefault();
    this.props.stripe
    .createToken({
      name: 'Jenny Rosen'
    }).then( ({token}) => {
      console.log('Received Stripe token:', token);
    });
  }

  render() {
    return (
      <form onSubmit={evt => this.handleSubmit(evt)}>
        <CardSection />
        <button>Confirm order</button>
      </form>
    );
  }
}


/**
 * SEPA payment page, kept as dedicated page to allow
 * for high levels of security control through CSP etc.
 */
var SEPA = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  }, 
  getInitialState: function() {
    return {
      stripeLoaded: false
    };
  },
  componentDidMount: function() {
    if (typeof window === "undefined") return;
    if (window.document === "undefined") return;
    var head = window.document.querySelector('head');
    var script = window.document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.onload = (e) => this.setState({ stripeLoaded: true });
    head.appendChild(script);
  },
  render: function() {
    return (
      <div className={'row'}>
        <div>
          <p>SEPA PAYMENT PAGE</p>
          { this.getSepaForm() }
        </div>  
        <SmallPrint/>
        <MozillaFooter/>
      </div>
    );
  },
  getSepaForm: function() {
    if(!this.state.stripeLoaded) return null;

    let StripeElementHOCed = injectStripe(CheckoutForm);

    return (
      <StripeProvider apiKey="pk_test_12345">
        <Elements>
          <StripeElementHOCed />
        </Elements>
      </StripeProvider>
    );
  }
});

module.exports = SEPA;
