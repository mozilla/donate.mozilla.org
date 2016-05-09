import React  from 'react';
import ThunderbirdFooter from '../../components/thunderbird/footer.jsx';
import Social from '../../components/thunderbird/social.jsx';
import ThankYouHeader from '../../components/thunderbird/thank-you-header.jsx';

var ThankYou = React.createClass({
  render: function() {
    var className = "row share-page thunderbird";
    if (this.props.test) {
      className += " " + this.props.test;
    }
    return (
      <div className={className}>
        <ThankYouHeader/>
        <Social/>
        <ThunderbirdFooter/>
      </div>
    );
  }
});

module.exports = ThankYou;
