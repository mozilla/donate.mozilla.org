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
          currency="PLN"
          minAmount="7"
          currencySymbol="zł"
          paypalLocal="PL"
        />
        <Footer/>
      </div>
    );
  }
});

module.exports = simplePaypal;
