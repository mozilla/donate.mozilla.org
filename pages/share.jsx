import React  from 'react';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import Social from '../components/social.jsx';

var ThankYou = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  render: function() {
    return (
      <div className="mozilla-eoy-donation">
        <Header/>
        <div>
          <div id="header-copy">
            <h1>{this.getIntlMessage('tell_your_friends')}</h1>
            <h4>{this.getIntlMessage('help_spread_the_word')}</h4>
          </div>
          <Social/>
          <Footer/>
        </div>
      </div>
    );
  }
});

module.exports = ThankYou;
