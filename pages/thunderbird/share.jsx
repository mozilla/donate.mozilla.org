import React  from 'react';
import ThunderbirdFooter from '../../components/thunderbird/footer.jsx';
import Social from '../../components/thunderbird/social.jsx';
import ThankYouHeader from '../../components/thunderbird/thank-you-header.jsx';

var ThankYou = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  propTypes: {
    test: React.PropTypes.string
  },
  render: function() {
    var className = "row share-page thunderbird";
    var language = this.context.intl.locale;
    if (this.props.test) {
      className += " " + this.props.test;
    }
    return (
      <div className={className}>
        <ThankYouHeader/>
        <Social language={language}/>
        <ThunderbirdFooter/>
      </div>
    );
  }
});

module.exports = ThankYou;
