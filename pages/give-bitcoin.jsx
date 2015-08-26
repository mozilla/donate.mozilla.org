import React from 'react';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import { IntlMixin, FormattedHTMLMessage } from 'react-intl';

var giveBitcoin = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    return (
      <div className="coinbase-page mozilla-eoy-donation">
        <Header/>
        <div id="header-copy">
          <h2>{this.getIntlMessage('help_protect_the_web')}</h2>
        </div>

        <div className="container" id="form-wrapper">
          <div className="wrap">
            <div className="row">
              <a href={process.env.COINBASE_ENDPOINT + "/checkouts/a9b87242f4430d841e140fdc90b81df2"}>
                <img src="/images/bitcoin_donation_large.png" alt="Donate Bitcoins"/>
              </a>
            </div>
          </div>
          <div className="row">
            <p className="donation-notice">
              <small>
                <FormattedHTMLMessage message={this.getIntlMessage('donation_notice_bitcoin')} />
              </small>
            </p>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
});

module.exports = giveBitcoin;
