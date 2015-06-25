var React = require('react');
var Footer = require('../components/footer.jsx');
var Header = require('../components/header.jsx');
var SimplePaypal = require('../components/simple-paypal.jsx');
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
          currencySymbol={this.props.currencySymbol}
          paypalLocal={this.props.paypalLocal}
        />
        <Footer/>
      </div>
    );
  }
});

module.exports = simplePaypal;
