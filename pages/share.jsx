import React  from 'react';
import MozillaFooter from '../components/footer-mozilla.jsx';
import Social from '../components/social.jsx';
import ThankYouHeader from '../components/thank-you-header.jsx';

var ThankYou = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  propTypes: {
    test: React.PropTypes.string
  },
  render: function() {
    var className = "row share-page";
    var language = this.context.intl.locale;

    if (this.props.test) {
      className += " " + this.props.test;
    }
    return (
      <div className={className}>
        <ThankYouHeader/>
        <Social language={language}/>
        <MozillaFooter/>
      </div>
    );
  }
});

module.exports = ThankYou;
