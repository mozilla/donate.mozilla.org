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
    return (
      <div className="share-page">
        <div className="container">
          <h3>
            <div>{this.context.intl.formatMessage({id: 'tell_your_friends'})}</div>
            <div>{this.context.intl.formatMessage({id: 'help_spread_the_word'})}</div>
          </h3>
          <div className="row">
            <div className="half" id="facebook">
              <div className="social-button"></div>
              <a href={facebookShareURL} target="_blank">
                <i className="fa fa-facebook fa-4x"></i>
                <div>facebook</div>
              </a>
            </div>
            <div className="half" id="twitter">
              <div className="social-button"></div>
              <a href={twitterShareURL} target="_blank">
                <i className="fa fa-twitter fa-5x"></i>
                <div>twitter</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

});
