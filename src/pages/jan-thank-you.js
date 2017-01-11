// this will ignore that Bad Invocation error which is a bug in JSXHint
/* jshint -W067 */

import React from 'react';
import MozillaFooter from '../components/mozilla/footer.js';
import ThankYouHeader from '../components/jan-thank-you-header.js';
import analytics from '../lib/analytics.js';

var pageDataSet = {
  cute: {
    videoSrc: [
      "https://d24kjznqej0s8a.cloudfront.net/2016/eoy/Cute/Cute_Final.mp4",
      "https://d24kjznqej0s8a.cloudfront.net/2016/eoy/Cute/Cute_Final.webm"
    ],
    thankYouSentenceId: "cute_thank_you"
  },
  sincere: {
    videoSrc: [
      "https://d24kjznqej0s8a.cloudfront.net/2016/eoy/Sincere/Sincere_Final.mp4",
      "https://d24kjznqej0s8a.cloudfront.net/2016/eoy/Sincere/Sincere_Final.webm"
    ],
    thankYouSentenceId: "sincere_thank_you"
  },
  superhero: {
    videoSrc: [
      "https://d24kjznqej0s8a.cloudfront.net/2016/eoy/Hero/Hero_Final.mp4",
      "https://d24kjznqej0s8a.cloudfront.net/2016/eoy/Hero/Hero_Final.webm"
    ],
    thankYouSentenceId: "superhero_thank_you"
  }
};

var ThankYou = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  componentDidMount: function() {
    analytics();
  },
  render: function() {
    var className = "row thank-you-page";
    if (this.props.test) {
      className += " " + this.props.test;
    }
    var pageData = pageDataSet[this.props.route.pageType];
    return (
      <div className="jan-thank-you">
        <div className={className}>
          <ThankYouHeader thankYouSentenceId={pageData.thankYouSentenceId}/>
          <div className="video-container">
            <video width="600" height="480" controls>
            {
              pageData.videoSrc.map(function(videoSrc) {
                return (<source src={videoSrc} />);
              })
            }
            </video>
            <MozillaFooter/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ThankYou;
