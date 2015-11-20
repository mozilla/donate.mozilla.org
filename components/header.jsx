import React from 'react';

var Footer = React.createClass({
  render: function() {
    return (
      <div className="header">
        <h1>
          <img alt={this.props.alt} src="/images/mozilla.svg" />
        </h1>
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
