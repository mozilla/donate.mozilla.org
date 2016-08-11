import React  from 'react';
import MozillaFooter from '../components/mozilla/footer.js';
import Social from '../components/social.js';
import ThankYouHeader from '../components/thank-you-header.js';

var ThankYou = React.createClass({
  render: function() {
    var className = "row share-page";
    if (this.props.test) {
      className += " " + this.props.test;
    }
    return (
      <div className={className}>
        <ThankYouHeader/>
        <Social/>
        <MozillaFooter/>
      </div>
    );
  }
});

module.exports = ThankYou;
