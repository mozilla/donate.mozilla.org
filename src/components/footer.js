import React from 'react';

var Footer = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    return (
      <footer>
        <div className="footer">
          <div className="footer-links">
            <ul>
              <li><a href="mailto:network@mozillafoundation.org" target="_blank">{this.context.intl.formatMessage({id: 'email'})}</a></li>
              <li><a href="https://twitter.com/mozilla" target="_blank">{this.context.intl.formatMessage({id: 'twitter'})}</a></li>
              <li><a href="https://www.facebook.com/mozilla" target="_blank">{this.context.intl.formatMessage({id: 'facebook'})}</a></li>
              <li>
                <a href="https://creativecommons.org/licenses/by/4.0" target="_blank">
                  {this.context.intl.formatMessage({id: 'license'})}
                </a>
              </li>
              <li>
                <a href="https://www.mozilla.org/about/governance/policies/participation/" target="_blank">
                  {this.context.intl.formatMessage({id: 'participation_guidelines'})}
                </a>
              </li>
              <li>
                <a href="https://www.mozilla.org/about/legal/" target="_blank">
                  {this.context.intl.formatMessage({id: 'legalNotices'})}
                </a>
              </li>
              <li>
                <a href="https://www.mozilla.org/privacy/" target="_blank">
                  {this.context.intl.formatMessage({id: 'privacyPolicyFooter'})}
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-info">
            <div className="footer-logo">
              <a href="https://foundation.mozilla.org"><img src="/assets/images/mozilla.1068965acefde994a71c187d253aca2b.svg"/></a>
            </div>
            <div className="footer-break">

            </div>
            <div className="footer-paragraph">
              <p className="license">
                {this.props.children}
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
});

module.exports = Footer;
