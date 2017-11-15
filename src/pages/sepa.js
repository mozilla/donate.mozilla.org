import React from 'react';
import MozillaFooter from '../components/mozilla/footer.js';
import Header from '../components/header.js';
import SmallPrint from '../components/small-print.js';
import parseLocationSearch from '../lib/location-search-parser.js';
import AmountButtons from '../components/amount-buttons.js';
import Frequency from '../components/donation-frequency.js';
import { connect } from 'react-redux';

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
      <form className="row full">
          <label htmlFor={'namefield'}>Name</label>
          <input type="text" id={'namefield'} onChange={e => this.handleName(e)}/>

          <label htmlFor={'ibanfield'}>IBAN</label>
          <input type="text" id={'ibanfield'} onChange={e => this.handleIBAN(e)}/>

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
            iban: this.state.iban
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
function(state) {
  return {
    frequency: state.donateForm.frequency,
    amount: state.donateForm.amount
  };
},
function(dispatch) {
  // We don't allow the SEPA "page" itself to set
  // anything. That is the responsibility of the
  // frequency/amount components.
  return {};
})(SEPA);
