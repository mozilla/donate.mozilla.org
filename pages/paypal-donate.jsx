import React from 'react';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import SimplePaypal from '../components/simple-paypal.jsx';
import { IntlMixin } from 'react-intl';

var simplePaypal = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    return (
      <div className="mozilla-eoy-donation">
        <Header/>
        <SimplePaypal
          presets={this.props.presets}
          currency={this.props.currency}
          amount={this.props.amount}
          frequency={this.props.frequency}
          paypalLocal={this.props.paypalLocal}
          locales={this.props.locales}
        />
        <Footer/>
      </div>
    );
  }
});

module.exports = simplePaypal;
