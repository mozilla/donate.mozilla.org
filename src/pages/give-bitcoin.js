import React from 'react';
import MozillaFooter from '../components/mozilla/footer.js';
import Header from '../components/header.js';
import { FormattedHTMLMessage } from 'react-intl';

var giveBitcoin = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    return (
      <div className="coinbase-page row">
        <Header>
          <h2>{this.context.intl.formatMessage({id: 'help_protect_the_web'})}</h2>
        </Header>

        <div className="container">
          {/*<div className="wrap">
            <div className="row">
              <a className="coinbase-button" href="https://www.coinbase.com/checkouts/a9b87242f4430d841e140fdc90b81df2">
                <i className="fa fa-shopping-cart"></i> {this.context.intl.formatMessage({id: 'donate_butcoins'})}
              </a>
            </div>
          </div>*/}
          <div className="row">
            <p className="donation-notice">
              <FormattedHTMLMessage id='donation_notice_bitcoin_disabled' />
            </p>
          </div>
        </div>
        <MozillaFooter/>
      </div>
    );
  }
});

module.exports = giveBitcoin;
