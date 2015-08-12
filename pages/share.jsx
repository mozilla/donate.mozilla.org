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
            <h1>Tell your friends</h1>
            <h4>We need your help to spread the word.</h4>
          </div>
          <Social/>
          <Footer/>
        </div>
      </div>
    );
  }
});

module.exports = ThankYou;
