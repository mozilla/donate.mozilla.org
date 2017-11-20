import React from 'react';

import MozillaFooter from '../components/mozilla/footer.js';
import Header from '../components/header.js';
import SmallPrint from '../components/small-print.js';
import AmountButtons from '../components/amount-buttons.js';
import Frequency from '../components/donation-frequency.js';

import parseLocationSearch from '../lib/location-search-parser.js';
import submit from '../lib/submit.js';

import { connect } from 'react-redux';
import { setCurrency } from '../actions';


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
      stripeLoaded: false,
      initialFieldFocused : false
    };
  },

  componentWillMount: function() {
    this.search = parseLocationSearch(this.props.location);
    this.props.setCurrency();
  },

  /**
   * In order to work with Stripe for the SEPA transfers,
   * we need to make sure Stripe.js is loaded "the normal way"
   * as far as the browser is concerned.
   *
   * This means injecting the script element responsible for
   * loading Stripe.js into the document head.
   *
   * Note that this page should only work if STRIPE_SEPA_ENABLED is set.
   */
  componentDidMount: function() {
    if (typeof window === "undefined") return;
    if (window.document === "undefined") return;
    
    var head = window.document.querySelector('head');
    var script = window.document.createElement('script');
    
    script.src = 'https://js.stripe.com/v3/';
    script.onload = (e) => this.setState({ stripeLoaded: true });
    head.appendChild(script);
  },

  componentDidUpdate: function() {
    if (!this.state.initialFieldFocused) {
      this.setState({
        initialFieldFocused: true
      });
    }
  },

  render: function() {
    return (
      <div className={'row'}>
        <Header/>
        <div className="container">
          <h3>Donate via SEPA</h3>
          { this.showLeadinContent() }
          { this.getSepaForm() }
        </div>
        <SmallPrint/>
        <MozillaFooter/>
      </div>
    );
  },

  showLeadinContent: function() {
    if (!this.props.amount || this.state.showChangeForm) {
      return [<Frequency key={'freq'}/>, <AmountButtons key={'amt'}/>];
    }

    // TODO: I'm not a fan of using <a href=#> but we'll need a user-tabbable
    //       element here so we might be able to do a <span> with a tabindex=0
    //       so that people can tab to it to trigger the freq/amount components.

    return [
      <h4 key={'commit_msg'}>
        Please fill in the following fields to finalize your {this.props.frequency} donation of {this.props.amount} euros.
      </h4>,
      <p key={'change_msg'}>
        <a href='#' onClick={evt => this.setState({ showChangeForm: true }) }>
          Click here to change the amount and/or frequency.
        </a>
      </p>
    ];
  },

  getSepaForm: function() {
    if (!this.state.stripeLoaded) return null;

    // References are a bit odd, and render will retrigger
    // the ref 'attribute' with null after initial binding.
    let inputFocus = element => {
      if (element && !this.nameField) {
        this.nameField = element;
        element.focus();
      }
    };

    return (
      <div>
        <form className="row full">
          <label htmlFor={'namefield'}>Name</label>
          <input ref={inputFocus} type="text" id={'namefield'} onChange={e => this.handleName(e)}/>

          <label htmlFor={'emailfield'}>Email Address</label>
          <input type="text" id={'emailfield'} onChange={e => this.handleEmail(e)}/>

          <label htmlFor={'ibanfield'}>Account Number (IBAN)</label>
          <input type="email" id={'ibanfield'} onChange={e => this.handleIBAN(e)}/>

          <div className="submit-button">
            <button className="donate-submit submit-btn" onClick={e => this.handleSubmit(e)}>Submit</button>
          </div>
        </form>
        <div className="sepa-mandate">
          <p>
            By providing your IBAN and confirming this payment, you are authorizing Mozilla Foundation and Stripe, our payment service provider, to send instructions to your bank to debit your account and your bank to debit your account in accordance with those instructions.
          </p>
          <p>
            You are entitled to a refund from your bank under the terms and conditions of your agreement with your bank. A refund must be claimed within 8 weeks starting from the date on which your account was debited.
          </p>
        </div>
      </div>
    );
  },

  handleName(e) {
    let name = e.target.value;
    this.setState({ name });
  },

  handleIBAN(e) {
    let iban = e.target.value;
    this.setState({ iban });
  },

  handleEmail(e) {
    let email = e.target.value;
    this.setState({ email });
  },

  handleSubmit(e) {
    e.preventDefault();
    // See https://stripe.com/docs/sources/sepa-debit#prerequisite
    if (typeof Stripe !== 'undefined') {
      this.setState({ submitting: true }, () => this.submitSEPAPayment());
    }
  },

  submitSEPAPayment() {
    let key = process.env.STRIPE_PUBLIC_KEY;
    let stripe = Stripe(key);
    let sourceData = {
      type: 'sepa_debit',
      sepa_debit: {
        iban: this.state.iban,
        email: this.state.email
      },
      currency: 'eur',
      owner: {
        name: this.state.name
      }
    };

    // NOTE: the following code is commented off, to allow for code path testing.
    //    
    // stripe.createSource(sourceData).then(result => this.handleStripeSourceResponse(result));

    this.handleStripeSourceResponse({
      testing: true,
      error: false,
      source: 'abcd1234'
    });
  },

  handleStripeSourceResponse(result) {
    console.log(result);

    if (result.error) {
      // this would be bad, and good error handling will
      // be necessary.
    }

    if (result.source) {
      // communicate the source and this.search.amount to
      // our server, so that we can perform a charge.

      let source = result.source;
      let amount = this.props.amount;
      let frequency = this.props.frequency;
      let email = this.state.email

      if (frequency === 'single') {
        frequency = 'one-time';
      }

      submit('/api/stripe/sepa',
        {
          currency: 'eur',
          amount,
          frequency,
          source,
          description: 'sepa transaction description goes here?',
          email,
          country: 'this should  probably not matter?',
          locale: this.context.intl.locale,
          signup: 'we cannot know this until post-process?'
        },
        success => this.handleSEPASuccess(success),
        error => this.handleSEPAfailure(error)
      );
    }
  },

  handleSEPASuccess(success) {
    // TODO: FIXME: this may need UX
    window.location = '/thank-you/?' + [
      `payment=sepa`,
      `str_amount={amount}`,
      `str_currency=eur`,
      `str_id={success.id}`,
      `str_frequency={freq}`,
      `email={this.state.email}`
    ].join('&');
  },

  handleSEPAfailure(error) {
    // TODO: FIXME: this needs UX to notify the user of what went wrong.
    console.error(error);

    // let code = error.code;
    // let rawType = error.rawType;
  }
});


/**
 * When the SEPA page loads, we need to make
 * sure it has a way to force the currency
 * to euro. We set up a special 'setCurrency'
 * function for this, which takes no arguments
 * and is called as this.props.setCurrency()
 * just prior to component mounting.
 */
module.exports = connect(
  function bindAppStateToComponentProps(state) {
    return {
      frequency: state.donateForm.frequency,
      amount: state.donateForm.amount,
      currency: state.donateForm.currency
    };
  },
  function bindDispatchFunctionsToComponentProps(dispatch) {
    return {
      setCurrency: function() {
        dispatch(setCurrency({ code: 'eur' }));
      }
    };
  }
)(SEPA);
