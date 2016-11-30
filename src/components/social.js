import React from 'react';

module.exports = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
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
              <a href={facebookShareURL} target="_blank">
                <i className="fa fa-facebook fa-4x"></i>
                <div>facebook</div>
              </a>
            </div>
            <div className="third" id="twitter">
              <div className="social-button"></div>
              <a href={twitterShareURL} target="_blank">
                <i className="fa fa-twitter fa-5x"></i>
                <div>twitter</div>
              </a>
            </div>
          </div>
          {/*Test where a share via email button is added along with Facebook and Twitter*/}
          <div className="row social-with-email">
            <div className="third" id="facebook">
              <div className="social-button"></div>
              <a href={facebookShareURL} target="_blank">
                <i className="fa fa-facebook fa-2x"></i>
                <div>facebook</div>
              </a>
            </div>
            <div className="third" id="twitter">
              <div className="social-button"></div>
              <a href={twitterShareURL} target="_blank">
                <i className="fa fa-twitter fa-2x"></i>
                <div>twitter</div>
              </a>
            </div>
            <div className="third email-share email-share-test" id="email">
              <div className="social-button"></div>
              <a href={emailShareURL} target="_blank">
              <i className="fa fa-envelope fa-2x"></i>
                <div>{this.context.intl.formatMessage({id: 'email'})}</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

});
