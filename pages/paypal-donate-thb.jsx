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
          currency="THB"
          minAmount="70"
          currencySymbol="฿"
          paypalLocal="th_TH"
        />
        <Footer/>
      </div>
    );
  }
});

module.exports = simplePaypal;
