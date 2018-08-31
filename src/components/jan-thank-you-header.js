import React from 'react';

module.exports = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  renderMessage: function() {
    return (
      <span>
        <h1>
          <div>{ this.context.intl.formatMessage({id: this.props.thankYouSentenceId}) }</div>
        </h1>
      </span>
    );
  },
  render: function() {
    return (
      <div>
        <div className="header baseline-header">
          {this.renderMessage()}
          <img width="100" height="100" className="auto-margin homepage-image" src="/assets/images/pink-heart.png"/>
        </div>
      </div>
    );
  }

});
