import React  from 'react';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import Social from '../components/social.jsx';

var ThankYou = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  render: function() {
    var language = this.props.locales[0];
    var className = "row";
    if (this.props.test) {
      className += " " + this.props.test;
    }
    return (
      <div className={className}>
        <Header>
          <h1>{this.getIntlMessage('tell_your_friends')}</h1>
          <h4>{this.getIntlMessage('help_spread_the_word')}</h4>
        </Header>
        <Social language={language}/>
        <Footer/>
      </div>
    );
  }
});

module.exports = ThankYou;
