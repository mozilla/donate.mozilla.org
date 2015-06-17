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
          currency="USD"
          minAmount="2"
          currencySymbol="$"
          paypalLocal="US"
        />
        <Footer/>
      </div>
    );
  }
});

module.exports = simplePaypal;
