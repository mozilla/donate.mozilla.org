import React from 'react';
import MozillaFooter from '../components/mozilla/footer.js';
import ThankYouHeader from '../components/jan-thank-you-header.js';
import ga from 'react-ga';

var pageDataSet = {
  cute: {
    videoSrc: [
      "https://d24kjznqej0s8a.cloudfront.net/2016/eoy/Cute/Cute_Final.mp4",
      "https://d24kjznqej0s8a.cloudfront.net/2016/eoy/Cute/Cute_Final.webm"
    ],
    thankYouSentenceId: "cute_thank_you_evergreen"
  },
  sincere: {
    videoSrc: [
      "https://d24kjznqej0s8a.cloudfront.net/2016/eoy/Sincere/Sincere_Final.mp4",
      "https://d24kjznqej0s8a.cloudfront.net/2016/eoy/Sincere/Sincere_Final.webm"
    ],
    thankYouSentenceId: "sincere_thank_you_evergreen"
  },
  superhero: {
    videoSrc: [
      "https://d24kjznqej0s8a.cloudfront.net/2016/eoy/Hero/Hero_Final.mp4",
      "https://d24kjznqej0s8a.cloudfront.net/2016/eoy/Hero/Hero_Final.webm"
    ],
    thankYouSentenceId: "superhero_thank_you_evergreen"
  }
};

var ThankYou = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  videoGaEvent(props) {
    props.category = "Thank You Video";
    ga.event(props);
  },
  componentDidMount() {
    var video = this.refs.video;
    var videoId = pageDataSet[this.props.route.pageType];

    video.addEventListener("play", (e) => {
      this.videoGaEvent({action: "Video started", label: videoId.thankYouSentenceId});
    });
    video.addEventListener("ended", (e) => {
      this.videoGaEvent({action: "Video ended", label: videoId.thankYouSentenceId});
    });
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
            <video width="600" height="480" ref="video" controls>
              {
                pageData.videoSrc.map(function(videoSrc, index) {
                  return (<source key={"vid-" + index} src={videoSrc} />);
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
