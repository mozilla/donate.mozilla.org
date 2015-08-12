import React from 'react';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import Signup from '../components/signup.jsx';
import Social from '../components/social.jsx';
import { FormattedHTMLMessage, IntlMixin } from 'react-intl';

var ThankYou = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    return (
      <div>
        <div className="mozilla-eoy-donation">
          <Header/>
          <div>
            <div id="header-copy">
              <div className="row">
                <h1>{ this.getIntlMessage("from_all_of_us_at_mozilla") }</h1>

                <h2>
                  <FormattedHTMLMessage
                    message={ this.getIntlMessage("thank_you_for_your_donation") }
                  />
                </h2>
              </div>
            </div>
            {this.props.params && !this.props.params.locale ? <Signup/> : <Social/> }
            <Footer/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ThankYou;
