import React from 'react';

module.exports = React.createClass({
  mixins: [require('react-intl').IntlMixin],
  render: function() {
    return (
      <div className="share-page">
        <div className="container">
          <h2>{this.getIntlMessage('share')}</h2>
          <div className="row">
            <div className="half" id="facebook">
              <a href="http://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdonate.mozilla.org">
                <i className="fa fa-facebook fa-5x"></i>

                <p>facebook</p>
              </a>
            </div>
            <div className="half" id="twitter">
              <a href="http://twitter.com/share?url=https%3A%2F%2Fdonate.mozilla.org&amp;text=I%20donated%20to%20%40mozilla%20today%20because%20I%20%23lovetheweb.%20Join%20me%20and%20help%20build%20%2B%20protect%20the%20Web%20forever%3A">
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
