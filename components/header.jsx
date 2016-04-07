import React from 'react';

module.exports = React.createClass({
  propTypes: {
    alt: React.PropTypes.string,
    locale: React.PropTypes.string
  },
  render: function() {
    var alt = "Mozilla";

    // FIXME: Should update the list in the regex for locales that did the translation
    // for whatever `alt` that has been translated.
    if (/^(en)(\b|$)/.test(this.props.locale)) {
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
