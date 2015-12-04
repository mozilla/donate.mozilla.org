import React from 'react';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import { IntlMixin, FormattedHTMLMessage } from 'react-intl';

var giveBitcoin = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    return (
      <div className="coinbase-page row new-flow-test">
        <Header>
          <h2>{this.getIntlMessage('help_protect_the_web')}</h2>
        </Header>

        <div className="container">
          <div className="wrap">
            <div className="row">
              <a className="coinbase-button" href="https://www.coinbase.com/checkouts/a9b87242f4430d841e140fdc90b81df2">
                <i className="fa fa-shopping-cart"></i> {this.getIntlMessage('donate_butcoins')}
              </a>
            </div>
          </div>
          <div className="row">
            <p className="donation-notice">
              <FormattedHTMLMessage message={this.getIntlMessage('donation_notice_bitcoin')} />
            </p>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
});

module.exports = giveBitcoin;
