import React from 'react';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import SimplePaypal from '../components/simple-paypal.jsx';
import { FormattedHTMLMessage, IntlMixin } from 'react-intl';

var simplePaypal = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    return (
      <div className="mozilla-eoy-donation">
        <Header/>
        <SimplePaypal
          currency={this.props.currency}
          minAmount={this.props.minAmount}
          paypalLocal={this.props.paypalLocal}
        />
        <Footer/>
      </div>
    );
  }
});

module.exports = simplePaypal;
