import React from 'react';
import MozillaFooter from '../components/mozilla/footer.js';
import Header from '../components/header.js';
import SmallPrint from '../components/small-print.js';
import parseLocationSearch from '../lib/location-search-parser.js';
import AmountButtons from '../components/amount-buttons.js';
import Frequency from '../components/donation-frequency.js';
import CurrencyDropdown from '../components/currency-dropdown.js';


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
          <Frequency/>
          <AmountButtons/>
          { this.getSepaForm() }
        </div>
        <SmallPrint/>
        <MozillaFooter/>
      </div>
    );
  },
  getSepaForm: function() {
    if (!this.state.stripeLoaded) {
      return null;
    }

    return (
      <form className="row full">
          <label htmlFor={'namefield'}>{"Account Holder's Name"}</label>
          <input ref="namefield" type="text" id={'namefield'} onChange={e => this.handleName(e)}/>

          <label htmlFor={'emailfield'}>Email Address</label>
          <input type="text" id={'emailfield'} onChange={e => this.handleEmail(e)}/>

          <label htmlFor={'ibanfield'}>Account Number (IBAN)</label>
          <input type="email" id={'ibanfield'} onChange={e => this.handleIBAN(e)}/>

          <div className="submit-button">
            <button className="donate-submit submit-btn" onClick={e => this.handleSubmit(e)}>Submit</button>
          </div>
      </form>
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

module.exports = SEPA;
