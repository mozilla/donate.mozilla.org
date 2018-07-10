import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';

var Footer = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    var year = new Date().getFullYear();
    return (
      <footer>
        <div className="footer">
          <div className="footer-links">
            <ul>
              <li><a href="https://www.mozilla.org/mission/" target="_blank">{this.context.intl.formatMessage({id: 'Mission'})}</a></li>
              <li><a href="https://www.mozilla.org/about/" target="_blank">{this.context.intl.formatMessage({id: 'About'})}</a></li>
              <li><a href="https://www.mozilla.org/contact/spaces/" target="_blank">{this.context.intl.formatMessage({id: 'Contact'})}</a>
              </li>
              <li><a href="https://www.mozilla.org/privacy/" target="_blank">{this.context.intl.formatMessage({id: 'privacyPolicyFooter'})}</a>
              </li>
              <li><a href="https://www.mozilla.org/about/legal/" target="_blank">{this.context.intl.formatMessage({id: 'legalNotices'})}</a>
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
                <FormattedHTMLMessage
                  id='footerLicense'
                  values={{year}}
                />
                <br/>
                {this.props.message}
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
});

module.exports = Footer;
