import React from 'react';

var Social = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    var appURL = process.env.APPLICATION_URI;
    var twitterShareURL = 'https://twitter.com/share?url=' + appURL +'/' + this.context.intl.locale + '/thunderbird/&text=' + encodeURIComponent(this.context.intl.formatMessage({id: 'i_donated_to_thunderbird'}));
    var facebookShareURL = 'https://www.facebook.com/sharer/sharer.php?u=' + appURL + '/' + this.context.intl.locale + '/thunderbird/';
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
module.exports = Social;
