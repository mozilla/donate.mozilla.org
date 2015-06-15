var React = require('react');
var Footer = require('../components/footer.jsx');
var Header = require('../components/header.jsx');
var SimplePaypal = require('../components/simple-paypal.jsx');

var simplePaypal = React.createClass({
  render: function() {
    return (
      <div>
        <div className="mozilla-eoy-donation">
          <Header/>
          <div>
            <SimplePaypal/>
            <Footer/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = simplePaypal;
