import React  from 'react';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import { IntlMixin } from 'react-intl';

var ThankYou = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    var className = "row new-flow-test";
    if (this.props.test) {
      className += " " + this.props.test;
    }
    return (
      <div className={className}>
        <Header/>
        <div className="survey-page">
          <div className="container">
            <iframe src="https://www.surveygizmo.com/s3/2472227/Mozilla-Donor-Survey" frameBorder="0" width="100%" height="600"></iframe>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
});

module.exports = ThankYou;
