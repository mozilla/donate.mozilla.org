import React from 'react';
import MozillaFooter from '../components/footer-mozilla.jsx';
import Header from '../components/header.jsx';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';

var giveBitcoin = injectIntl(React.createClass({
  render: function() {
    return (
      <div className="coinbase-page row">
        <Header>
          <h2>{this.props.intl.formatMessage({id: 'help_protect_the_web'})}</h2>
        </Header>

        <div className="container">
          <div className="wrap">
            <div className="row">
              <a className="coinbase-button" href="https://www.coinbase.com/checkouts/a9b87242f4430d841e140fdc90b81df2">
                <i className="fa fa-shopping-cart"></i> {this.props.intl.formatMessage({id: 'donate_butcoins'})}
              </a>
            </div>
          </div>
          <div className="row">
            <p className="donation-notice">
              <FormattedHTMLMessage message={this.props.intl.formatMessage({id: 'donation_notice_bitcoin'})} />
            </p>
          </div>
        </div>
        <MozillaFooter/>
      </div>
    );
  }
}));

module.exports = giveBitcoin;
