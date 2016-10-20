import React from 'react';
var IntlStub = require('./IntlStub.jsx');

var ContextStub = React.createClass({
  getChildContext: function() {
    var Context = {
      messages: require('../../public/locales.json')["en-US"],
      router: {
        makeHref: function() {},
        createHref: function() {},
        makePath: function() {},
        transitionTo: function() {},
        replaceWith: function() {},
        goBack: function() {},
        getCurrentPath: function() {},
        getCurrentRoutes: function() {},
        getCurrentPathname: function() {},
        getCurrentParams: function() {},
        getCurrentQuery: function() {},
        isActive: function() {},
        render: function() {}
      }
    };
    return Context;
  },
  render: function() {
    return (
      <IntlStub>{this.props.children}</IntlStub>
    );
  }
});

ContextStub.childContextTypes = {
  messages: React.PropTypes.object,
  router: React.PropTypes.object
};

module.exports = ContextStub;
