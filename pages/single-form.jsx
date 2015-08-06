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
        ad
        <Footer/>
      </div>
    );
  }
});

module.exports = simplePaypal;
