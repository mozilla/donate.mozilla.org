import React from 'react';

var Footer = React.createClass({
  render: function() {
    var waterMark;
    if (!this.props.hideWaterMark) {
      waterMark = (<img src="/images/mozilla.svg"/>);
    }
    return (
      <div className="header">
        {waterMark}
        <div className="header-copy">
          <div className="row">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Footer;
