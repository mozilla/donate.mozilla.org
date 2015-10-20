import React from 'react';

module.exports = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  render: function() {
    var twitterShareURL = 'http://twitter.com/share?url=https://donate.mozilla.org/' + this.props.language + '/&text=' + this.getIntlMessage('i_donated_to_mozilla');
    var facebookShareURL = 'http://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdonate.mozilla.org/' + this.props.language + '/';
    return (
      <div className="share-page">
        <div className="container">
          <h2>
            <div>{this.getIntlMessage('tell_your_friends')}</div>
            <div>{this.getIntlMessage('help_spread_the_word')}</div>
          </h2>
          <div className="row">
            <div className="half" id="facebook">
              <a href={facebookShareURL} target="_blank">
                <i className="fa fa-facebook fa-5x"></i>

                <p>facebook</p>
              </a>
            </div>
            <div className="half" id="twitter">
              <a href={twitterShareURL} target="_blank">
                <i className="fa fa-twitter fa-5x"></i>

                <p>twitter</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

});
