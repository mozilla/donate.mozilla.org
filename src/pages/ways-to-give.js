import React  from 'react';
import MozillaFooter from '../components/mozilla/footer.js';
import currencies from '../data/currencies.js';

var FormattedHTMLMessage = require("react-intl").FormattedHTMLMessage;

var WaysToGive = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    var className = "row faq-page";
    if (this.props.test) {
      className += " " + this.props.test;
    }
    return (
      <div className={className}>
        <div className="faq-header">
          <div className="container">
            <h1><FormattedHTMLMessage id='ways_to_give' /></h1>
          </div>
        </div>
        <div className="container">
          <h2><FormattedHTMLMessage id='credit_debit_paypal' /></h2>
          <p><FormattedHTMLMessage id='make_donation' /></p>
          <h2><FormattedHTMLMessage id='mail_check_heading' /></h2>
          <p><FormattedHTMLMessage id='mail_check_body' /></p>
          <address>
            Mozilla Foundation<br/>
            331 E. Evelyn Ave<br/>
            Mountain View, CA 94041<br/>
            USA
          </address>
          <p><FormattedHTMLMessage id='canadian_check_cost_info' /></p>
          <p><FormattedHTMLMessage id='foreign_check_cost_info' /></p>
          <h2><FormattedHTMLMessage id='currencies' /></h2>
          <p><FormattedHTMLMessage id='select_donation_currency' /></p>
          <ul className="currencyList">
            {Object.keys(currencies).map((currencyKey)=>{
              var currency = currencies[currencyKey];
              var url = `https://donate.mozilla.org/?currency=${currencyKey}&ref=EOYFR2016&utm_campaign=EOYFR2016&utm_source=wiki.mozilla.org&utm_medium=referral&utm_content=Ways_to_Give`;
              return <li key={currencyKey}><a href={url}>{`${currency.symbol} ${currency.code.toUpperCase()}`} </a></li>;
            })}
          </ul>
          <h2><FormattedHTMLMessage id='bank_transfer' /></h2>
          <p><FormattedHTMLMessage id='wire_transfer_cost_info' /></p>
          <p><FormattedHTMLMessage id='bank_transfer_info' /></p>
          <h2><FormattedHTMLMessage id='bitcoin' /></h2>
          <p><FormattedHTMLMessage id='bitcoin_info' /></p>
          <p><FormattedHTMLMessage id='bitcoin_more_info' /></p>
        </div>
        <MozillaFooter/>
      </div>
    );
  }
});

module.exports = WaysToGive;
