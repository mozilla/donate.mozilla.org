import React  from 'react';
import MozillaFooter from '../components/mozilla/footer.js';
import currencies from '../data/currencies.js';

var FormattedHTMLMessage = require("react-intl").FormattedHTMLMessage;

var WaysToGive = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  renderEnglishMemoLine: function() {
    if (/^(en-US|en-CA)(\b|$)/.test(this.context.intl.locale)) {
      return (
        <span> and include your email address on the memo line.</span>
      );
    }
    return (<div></div>);
  },
  render: function() {
    var className = "row faq-page ways-to-give-page";
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
          <h2 id="wire"><FormattedHTMLMessage id='bank_transfer_sepa' /></h2>
          <p>
            <b><FormattedHTMLMessage id='sepa_desc_new' /></b>
            {" "}
            <FormattedHTMLMessage id='sepa_desc' />
          </p>
          <br/>
          <h3 id="euro"><FormattedHTMLMessage id='euro_title' /></h3>
          <p>
            <b><FormattedHTMLMessage id='account_currency' /></b>
            {" "}
            <FormattedHTMLMessage id='euro_currency' />
            <br/>
            <b><FormattedHTMLMessage id='receiving_bank' /></b>
            {" Standard Chartered Bank"}
            <br/>
            <b><FormattedHTMLMessage id='city_and_country' /></b>
            {" "}
            <FormattedHTMLMessage id='frankfurt' />
            <br/>
            <b><FormattedHTMLMessage id='swift_code' /></b>
            {" SCBLDEFX"}
            <br/>
            <b><FormattedHTMLMessage id='beneficiary' /></b>
            {" SVB-Mozilla Foundation"}
            <br/>
            <b><FormattedHTMLMessage id='IBAN' /></b>
            {" DE67512305000500136802"}
          </p>
          <br/>
          <h3 id="gbp"><FormattedHTMLMessage id='gbp_title' /></h3>
          <p>
            <b><FormattedHTMLMessage id='account_currency' /></b>
            {" "}
            <FormattedHTMLMessage id='gbp_currency' />
            <br/>
            <b><FormattedHTMLMessage id='receiving_bank' /></b>
            {" National Westminster Bank"}
            <br/>
            <b><FormattedHTMLMessage id='city_and_country' /></b>
            {" "}
            <FormattedHTMLMessage id='london' />
            <br/>
            <b><FormattedHTMLMessage id='sort_code' /></b>
            {" 60-00-04"}
            <br/>
            <b><FormattedHTMLMessage id='account_number' /></b>
            {" 10017496"}
            <br/>
            <b><FormattedHTMLMessage id='beneficiary' /></b>
            {" SVB RE Mozilla Foundation"}
          </p>
          <p>
            <b><FormattedHTMLMessage id='swift_code' /></b>
            {" NWBKGB2L"}
            <br/>
            <b><FormattedHTMLMessage id='IBAN' /></b>
            {" GB77NWBK60000410017496"}
          </p>
          <p>
            <FormattedHTMLMessage
              id='physical_address'
              values={{
                MozillaMV: `331 E. Evelyn Ave, Mountain View, CA 94041 USA`
              }}
            />
          </p>
          <br/>
          <h3><FormattedHTMLMessage id='usd_title' /></h3>
          <p>
            <b><FormattedHTMLMessage id='receiving_bank' /></b>
            {" Silicon Valley Bank"}
            <br/>
            <b><FormattedHTMLMessage id='bank_address' /></b>
            {" 3003 Tasman Drive, Santa Clara, CA 94054 USA"}
          </p>
          <h4><FormattedHTMLMessage id='domestic_transfer' /></h4>
          <p>
            <b><FormattedHTMLMessage id='routing_transit' /></b>
            {" 121140399"}
            <br/>
            <b><FormattedHTMLMessage id='beneficiary' /></b>
            {" Mozilla Foundation"}
            <br/>
            <b><FormattedHTMLMessage id='account_number_usa' /></b>
            {" 3302228513"}
          </p>
          <h4><FormattedHTMLMessage id='international_transfer' /></h4>
          <p>
            <b><FormattedHTMLMessage id='routing_transit' /></b>
            {" 121140399"}
            <br/>
            <b><FormattedHTMLMessage id='beneficiary' /></b>
            {" Mozilla Foundation"}
            <br/>
            <b><FormattedHTMLMessage id='account_number_usa' /></b>
            {" 3302228513"}
            <br/>
            <b><FormattedHTMLMessage id='swift_code' /></b>
            {" SVBKUS6S"}
          </p>
          <br/>
          <h3><FormattedHTMLMessage id='other_currency' /></h3>
          <p>
            <FormattedHTMLMessage id='other_currency_iban' />
          </p>
          <h2 id="check"><FormattedHTMLMessage id='mail_check_heading' /></h2>
          <p><FormattedHTMLMessage id='mail_check_body2' /></p>
          <address>
            Mozilla Foundation<br/>
            331 E. Evelyn Ave<br/>
            Mountain View, CA 94041<br/>
            USA
          </address>{this.renderEnglishMemoLine()}
          <br/>
          <h2><FormattedHTMLMessage id='currencies' /></h2>
          <p><FormattedHTMLMessage id='select_donation_currency' /></p>
          <ul className="currencyList">
            {Object.keys(currencies).map((currencyKey)=>{
              var currency = currencies[currencyKey];
              var url = `https://donate.mozilla.org/?currency=${currencyKey}&ref=EOYFR2016&utm_campaign=EOYFR2016&utm_source=wiki.mozilla.org&utm_medium=referral&utm_content=Ways_to_Give`;
              return <li key={currencyKey}><a href={url}>{`${currency.code.toUpperCase()} ${currency.symbol}`} </a></li>;
            })}
          </ul>
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
