import React from 'react';

var Footer = React.createClass({
  render: function() {
    return (
      <div className="header">
        <img src="/images/mozilla.svg"/>
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
