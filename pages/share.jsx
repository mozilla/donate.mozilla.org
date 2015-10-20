import React  from 'react';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import Social from '../components/social.jsx';
import SocialTest from '../components/social-test.jsx';
import ThankYouHeader from '../components/thank-you-header.jsx';
import { IntlMixin } from 'react-intl';

var ThankYou = React.createClass({
  mixins: [IntlMixin],
  renderBaseline: function() {
    var language = this.props.locales[0];
    return (
      <span className="base-line-share">
        <Header>
          <h1>{this.getIntlMessage('tell_your_friends')}</h1>
          <h4>{this.getIntlMessage('help_spread_the_word')}</h4>
        </Header>
        <Social language={language}/>
        <Footer/>
      </span>
    );
  },
  renderNewFlow: function() {
    var language = this.props.locales[0];
    return (
      <span className="new-flow-share">
        <ThankYouHeader/>
        <SocialTest language={language}/>
        <Footer/>
      </span>
    );
  },
  render: function() {
    var className = "row";
    if (this.props.test) {
      className += " " + this.props.test;
    }
    return (
      <div className={className}>
        {this.renderBaseline()}
        {this.renderNewFlow()}
      </div>
    );
  }
});

module.exports = ThankYou;
