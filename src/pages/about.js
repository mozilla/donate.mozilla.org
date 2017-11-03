import React from 'react';
import MozillaFooter from '../components/mozilla/footer.js';
import SmallPrint from '../components/small-print.js';
import SingleForm from '../components/single-form.js';

module.exports = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      aboutCopy: null
    };
  },
  componentDidMount: function() {
    var aboutCopy = (<span>{this.context.intl.formatMessage({id: 'additional_info'})}</span>);
    if (this.props.test === "nnsnippet1707") {
      aboutCopy = (
        <span>
          is a global nonprofit that stands up for an open and healthy Internet, where telecom companies are not allowed to censor or throttle your access to the web based on the content you want to see. Will you give today?
        </span>
      );
    } else if (this.props.test === "misinformation") {
      aboutCopy = (
        <span>
          Fake News threatens to make the Web divisive, dangerous & overall - not fun. As a non-profit, we rely on donations to carry out our mission — and when you support Mozilla, you’re standing up for a healthy Internet. Donate today.
          <br/>
          <br/>
          Not ready to donate? Subscribe to our <a href="https://www.mozilla.org/newsletter/">newsletter</a> to learn more about what we do.
        </span>
      );
    } else if (this.props.test === "decentralization") {
      aboutCopy = (
        <span>
          We work every year to keep the Web open & free; it’s thanks to thousands of people around the world that we can continue to fight for people, not profit. Your donation helps us meet our goals for 2018. Can you chip in today?
          <br/>
          <br/>
          Not ready to donate? Subscribe to our <a href="https://www.mozilla.org/newsletter/">newsletter</a> to learn more about what we do.
        </span>
      );
    } else if (this.props.test === "digital-inclusion") {
      aboutCopy = (
        <span>
          You can help Mozilla continue to defend the web from trolls and cyberbullies.  An inclusive, diverse Web is better for all of us, and your support helps us to achieve that. Make a donation today, and stand up for a healthy Internet.
          <br/>
          <br/>
          Not ready to donate? Subscribe to our <a href="https://www.mozilla.org/newsletter/">newsletter</a> to learn more about what we do.
        </span>
      );
    }
    this.setState({
      aboutCopy: aboutCopy
    });
  },
  render: function() {
    var className = "row additional-info-container";
    if (this.props.test) {
      className += " " + this.props.test;
    }
    var aboutCopy = this.state.aboutCopy;
    return (
      <div className={className}>
        <div className="additional-info-page">
          <div className="container additional-page">
            <img className="heart-image icon-baseline" height="100" width="107" src="/assets/images/heart.ce7d2d59c757e1598e244e546426577c.svg"/>
            <img className="heart-image icon-variant" height="100" width="107" src="/assets/images/pixel-heart.svg"/>
            <div>
              <img className="mozilla-watermark" src="/assets/images/mozilla.1068965acefde994a71c187d253aca2b.svg"/>
              {aboutCopy}
            </div>
          </div>
          <SingleForm
            currency={this.props.currency}
            presets={this.props.presets}
            amount={this.props.amount}
            frequency={this.props.frequency}
            country={this.props.country}
          />
        </div>
        <SmallPrint/>
        <MozillaFooter/>
      </div>
    );
  }
});
