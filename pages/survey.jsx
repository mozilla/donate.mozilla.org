import React  from 'react';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import SurveyGizmo from '../components/surveygizmo.jsx';
import { IntlMixin } from 'react-intl';

var ThankYou = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    var className = "row new-flow-test";
    var language = this.props.locales[0];
    if (this.props.test) {
      className += " " + this.props.test;
    }
    return (
      <div className={className}>
        <Header />
        <SurveyGizmo language={language}/>
        <Footer/>
      </div>
    );
  }
});

module.exports = ThankYou;
