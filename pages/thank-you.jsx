// this will ignore that Bad Invocation error which is a bug in JSXHint
/* jshint -W067 */

import React from 'react';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import Signup from '../components/signup.jsx';
import Social from '../components/social.jsx';
import { FormattedHTMLMessage, IntlMixin } from 'react-intl';
import analytics from '../public/js/analytics.js';

var ThankYou = React.createClass({
  mixins: [IntlMixin],
  componentDidMount: function() {
    analytics();
  },
  render: function() {
    var locale = this.props.locales[0];
    return (
      <div>
        <div className="row">
          <Header>
            <h1>{ this.getIntlMessage("from_all_of_us_at_mozilla") }</h1>

            <h2>
              <FormattedHTMLMessage
                message={ this.getIntlMessage("thank_you_for_your_donation") }
              />
            </h2>
          </Header>
          <div>
            {this.props.params && ['de', 'en-US'].indexOf(locale) !== -1 ? <Signup locales={this.props.locales}/> : <Social language={locale}/> }
            <Footer/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ThankYou;
