import React from 'react';

import MozillaFooter from '../components/mozilla/footer.js';
import Header from '../components/header.js';
import SmallPrint from '../components/small-print.js';
import AmountButtons from '../components/amount-buttons.js';
import Frequency from '../components/donation-frequency.js';

import parseLocationSearch from '../lib/location-search-parser.js';

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
    setCurrency('ALL');
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
  componentDidUpdate: function() {
    if (!this.state.initialFieldFocused) {
      this.setState({
        initialFieldFocused: true
      });
      this.refs.namefield.focus();
    }
  },
  render: function() {
    return (
      <div className={'row'}>
        <Header/>
        <div className="container">
          <h4>Donate via SEPA</h4>
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
      <p key={'commit_msg'}>
        You are committing to a {this.props.frequency} donation of {this.props.amount} euro.
      </p>,
      <p key={'change_msg'}>
        <a href='#' onClick={evt => this.setState({ showChangeForm: true }) }>
          Click here to change the amount and/or frequency.
        </a>
      </p>
    ];
  },
  getSepaForm: function() {
    if (!this.state.stripeLoaded) {
      return null;
    }

    return (
      <div>
        <form className="row full">
          <label htmlFor={'namefield'}>Name</label>
          <input ref="namefield" type="text" id={'namefield'} onChange={e => this.handleName(e)}/>

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
      this.setState({ submitting: true }, () => {
        let key = process.env.STRIPE_PUBLIC_KEY;
        let stripe = Stripe(key);

        stripe.createSource({
          type: 'sepa_debit',
          sepa_debit: {
            iban: this.state.iban,
            email: this.state.email
          },
          currency: 'eur',
          owner: {
            name: this.state.name
          }
        }).then( result => {
          console.log(result);

          if (result.error) {
            // this would be bad, and good error handling will
            // be necessary.
          }

          if (result.source) {
            // communicate the source and this.search.amount to
            // our server, so that we can perform a charge.
          }
        });

      });
    }
  }
});

module.exports = connect(
  function matchStateToProps(state) {
    return {
      frequency: state.donateForm.frequency,
      amount: state.donateForm.amount
    };
  }
)(SEPA);
