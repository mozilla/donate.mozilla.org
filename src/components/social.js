import React from 'react';
import reactGA from 'react-ga';

var SocialComponentItem = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    if (/^(en)(\b|$)/.test(this.context.intl.locale)) {
      return (
        <div onClick={this.props.onClick} className="share-progress-wrapper">
          <div className={this.props.shareProgress}></div>
          {this.props.children}
        </div>
      );
    }
    return (
      <a onClick={this.props.onClick} href={this.props.href} target="_blank">
        {this.props.children}
      </a>
    );
  }
});

module.exports = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  socialClick: function(category, action, label) {
    reactGA.event({
      category: "Social",
      action: "Clicked on button",
      label
    });
    return true;
  },
  facebookClick: function() {
    return this.socialClick("facebook");
  },
  twitterClick: function() {
    return this.socialClick("twitter");
  },
  emailClick: function() {
    return this.socialClick("email");
  },
  render: function() {
    var appURL = process.env.APPLICATION_URI;
    var locale = this.context.intl.locale;
    var twitterShareURL = 'https://twitter.com/share?url=' + appURL +'/' + locale + '/&text=' + encodeURIComponent(this.context.intl.formatMessage({id: 'i_donated_to_mozilla'}));
    var facebookShareURL = 'https://www.facebook.com/sharer/sharer.php?u=' + appURL + '/' + locale + '/';
    var emailSubject = this.context.intl.formatMessage({id: 'share_email_subject'});
    var emailBody = this.context.intl.formatMessage({id: 'share_email_body'});
    var emailShareURL = 'mailto:someone@example.com?subject='+ emailSubject +'&body='+ emailBody +'';
    return (
      <div className="share-page">
        <div className="container">
          <h3>
            <div>{this.context.intl.formatMessage({id: 'tell_your_friends'})}</div>
            <div>{this.context.intl.formatMessage({id: 'help_spread_the_word'})}</div>
          </h3>
          {/*Baseline social shares with just Facebook and Twitter*/}
          <div className="row baseline-social">
            <div className="third" id="facebook">
              <div className="social-button"></div>
              <SocialComponentItem onClick={this.facebookClick} href={facebookShareURL} shareProgress="sp_177235 sp_fb_small">
                <i className="fa fa-facebook fa-4x"></i>
                <div>facebook</div>
              </SocialComponentItem>
            </div>
            <div className="third" id="twitter">
              <div className="social-button"></div>
              <SocialComponentItem onClick={this.twitterClick} href={twitterShareURL} shareProgress="sp_177236 sp_tw_small">
                <i className="fa fa-twitter fa-5x"></i>
                <div>twitter</div>
              </SocialComponentItem>
            </div>
          </div>
          {/*Test where a share via email button is added along with Facebook and Twitter*/}
          <div className="row social-with-email">
            <div className="third" id="facebook">
              <div className="social-button"></div>
              <SocialComponentItem onClick={this.facebookClick} href={facebookShareURL} shareProgress="sp_177235 sp_fb_small">
                <i className="fa fa-facebook fa-2x"></i>
                <div>facebook</div>
              </SocialComponentItem>
            </div>
            <div className="third" id="twitter">
              <div className="social-button"></div>
              <SocialComponentItem onClick={this.twitterClick} href={twitterShareURL} shareProgress="sp_177236 sp_tw_small">
                <div className='' ></div>
                <i className="fa fa-twitter fa-2x"></i>
                <div>twitter</div>
              </SocialComponentItem>
            </div>
            <div className="third email-share email-share-test" id="email">
              <div className="social-button"></div>
              <SocialComponentItem onClick={this.emailClick} href={emailShareURL} shareProgress="sp_177234 sp_em_small">
                <i className="fa fa-envelope fa-2x"></i>
                <div>{this.context.intl.formatMessage({id: 'email'})}</div>
              </SocialComponentItem>
            </div>
          </div>
        </div>
      </div>
    );
  }

});
