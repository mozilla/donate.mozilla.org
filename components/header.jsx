import React from 'react';

var Header = React.createClass({
  propTypes: {
    alt: React.PropTypes.string,
    children: React.PropTypes.any
  },
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    var alt = "Mozilla";

    // FIXME: Should update the list in the regex for locales that did the translation
    // for whatever `alt` that has been translated.
    if (/^(en)(\b|$)/.test(this.context.intl.locale)) {
      alt = this.props.alt;
    }
    return (
      <div className="header">
        <h1>
          <img alt={alt} src="/assets/images/mozilla.5e83dba715a0469b92071758876f0373.svg" />
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

module.exports = Header;
