import React  from 'react';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import Social from '../components/social.jsx';
import ThankYouHeader from '../components/thank-you-header.jsx';
import { IntlMixin } from 'react-intl';
import reactGA from 'react-ga';

var ThankYou = React.createClass({
  mixins: [IntlMixin],
  componentDidMount: function() {
    // We are using `transitionTo()` in /thank-you page, so when the user
    // finished the signup and being redirect here it doesn't get track because
    // react-router doesn't do a full page reload from /thank-you to /share page.
    var currentPage = window.location.pathname;
    reactGA.pageview(currentPage);
  },
  render: function() {
    var className = "row";
    var language = this.props.locales[0];
    if (this.props.test) {
      className += " " + this.props.test;
    }
    return (
      <div className={className}>
        <span className="base-line-share">
          <Header>
            <h1>{this.getIntlMessage('tell_your_friends')}</h1>
            <h4>{this.getIntlMessage('help_spread_the_word')}</h4>
          </Header>
        </span>
        <span className="new-flow-share">
          <ThankYouHeader/>
        </span>
        <Social language={language}/>
        <Footer/>
      </div>
    );
  }
});

module.exports = ThankYou;
