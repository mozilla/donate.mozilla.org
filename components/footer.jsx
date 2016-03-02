import React from 'react';
import { IntlMixin, FormattedHTMLMessage } from 'react-intl';

var Footer = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    var firefox_footer = this.getIntlMessage('firefox_footer');
    if (window.location.pathname.indexOf('thunderbird') !== -1) {
      firefox_footer = this.getIntlMessage('firefox_thunderbird_footer');
    }
    return (
      <footer>
        <div className="footer">
          <div className="row">
            <div className="half">
              <img src="/assets/images/mozilla.5e83dba715a0469b92071758876f0373.svg"/>
              <p className="license">
                <FormattedHTMLMessage
                  message={ this.getIntlMessage("footerLicense") }
                />
              </p>
              <p>
                {firefox_footer}
              </p>
            </div>
            <div className="quarter">
              <ul>
                <li><a href="https://www.mozilla.org/mission/" target="_blank">{this.getIntlMessage('Mission')}</a></li>
                <li><a href="https://www.mozilla.org/about/" target="_blank">{this.getIntlMessage('About')}</a></li>
                <li><a href="https://www.mozilla.org/contact/spaces/" target="_blank">{this.getIntlMessage('Contact')}</a>
                </li>
                <li><a href="https://www.mozilla.org/privacy/" target="_blank">{this.getIntlMessage('privacyPolicyFooter')}</a>
                </li>
                <li><a href="https://www.mozilla.org/about/legal/" target="_blank">{this.getIntlMessage('legalNotices')}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
});

module.exports = Footer;
