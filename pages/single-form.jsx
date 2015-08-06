import React from 'react';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import { FormattedHTMLMessage, IntlMixin } from 'react-intl';
import CTA from '../components/CTA.jsx';
import Frequency from '../components/donation-frequency.jsx';

var SingleForm = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    return (
      <div className="mozilla-eoy-donation">
        <Header/>
          <div className="container">
            <CTA>{this.getIntlMessage("donate_now")}</CTA>
            <Frequency/>
          </div>
        <Footer/>
      </div>
    );
  }
});

module.exports = SingleForm;
