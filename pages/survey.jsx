import React  from 'react';
import MozillaFooter from '../components/footer-mozilla.jsx';
import Header from '../components/header.jsx';

var Survey = React.createClass({
  render: function() {
    var className = "row";
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
        <MozillaFooter/>
      </div>
    );
  }
});

module.exports = Survey;
