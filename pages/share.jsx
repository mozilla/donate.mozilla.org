import React  from 'react';
import MozillaFooter from '../components/mozilla/footer.jsx';
import Social from '../components/social.jsx';
import ThankYouHeader from '../components/thank-you-header.jsx';

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
