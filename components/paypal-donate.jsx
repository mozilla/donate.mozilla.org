var React = require('react');
var Footer = require('../components/footer.jsx');
var Header = require('../components/header.jsx');
var SimplePaypal = require('../components/simple-paypal.jsx');

var simplePaypal = React.createClass({
  render: function() {
    return (
      <div className="mozilla-eoy-donation">
        <Header/>
        <SimplePaypal
          currency={this.props.currency}
          paypalLocal={this.props.paypalLocal}
          currencySymbol={this.props.currencySymbol}
          minAmount={this.props.minAmount}
        />
        <Footer/>
      </div>
    );
  }
});

module.exports = simplePaypal;
