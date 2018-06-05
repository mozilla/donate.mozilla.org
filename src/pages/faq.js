import React  from 'react';
import MozillaFooter from '../components/mozilla/footer.js';
import Link from '../components/link.js';
var FormattedHTMLMessage = require("react-intl").FormattedHTMLMessage;

var Panel = React.createClass({
  onClick: function() {
    var itemKey = this.props.itemKey;
    if (itemKey === this.props.activeKey) {
      itemKey = "";
    }
    this.props.activateKey(itemKey);
  },
  render: function() {
    var itemClassName = "collapse-item";
    var contentClassName = "collapse-content";
    if (this.props.itemKey === this.props.activeKey) {
      itemClassName += " collapse-item-active";
      contentClassName += " collapse-content-active";
    }
    return (
      <div id={this.props.itemKey} className={itemClassName}>
        <div onClick={this.onClick} className="collapse-header">{this.props.header}</div>
        <div className={contentClassName}>
          {this.props.children}
        </div>
      </div>
    );
  }
});

var Faq = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      activeKey: ""
    };
  },
  updateKey: function(newActiveKey) {
    if (newActiveKey !== this.state.activeKey) {
      this.setState({
        activeKey: newActiveKey
      });
    }
  },
  updateHash: function(key) {
    var hash = "";
    if (key) {
      hash = "#" + key;
    }
    history.replaceState({}, '', window.location.origin + window.location.pathname + window.location.search + hash);
    this.updateKey(key);
  },
  componentDidUpdate: function() {
    this.updateKey(window.location.hash.replace("#", ""));
  },
  componentDidMount: function() {
    this.updateKey(window.location.hash.replace("#", ""));
  },
  onKeyChange: function(key) {
    this.updateHash(key);
  },
  renderEnglishTaxItem: function() {
    if (/^(en-US)(\b|$)/.test(this.context.intl.locale)) {
      return (
        <Panel activeKey={this.state.activeKey} activateKey={this.onKeyChange} itemKey="item_tax_b" header="How can I get a receipt for U.S. tax preparation purposes?">
          <p>If you give to Mozilla online, you should immediately receive an emailed receipt for your donation that you can use for your U.S. tax preparation purposes. Please check your spam folder if you don’t see that email arrive in your inbox. If you need an additional copy of your receipt for your U.S. tax preparation purposes, please contact us at <a href="mailto:donate@mozilla.org">donate@mozilla.org</a>.</p>
        </Panel>
      );
    }
    return (<div></div>);
  },
  renderEnglishAmazonSmile: function() {
    if (/^(en-US)(\b|$)/.test(this.context.intl.locale)) {
      return (
        <Panel activeKey={this.state.activeKey} activateKey={this.onKeyChange} itemKey="item_amazon" header="I’m in the United States. Can I support Mozilla through the Amazon Smile Program?">
          <p>Yes! You can direct a small portion of what you spend on Amazon.com to support Mozilla by <a href="https://smile.amazon.com/ch/20-0097189">visiting this link to choose Mozilla</a> in the Amazon Smile program. Please remember to initiate all your purchases by starting at <a href="https://smile.amazon.com">smile.amazon.com</a>. (Unfortunately, this program is limited to U.S. residents only.)</p>
        </Panel>
      );
    }
    return (<div></div>);
  },
  renderEnglishMatchingFunds: function() {
    if (/^(en-US)(\b|$)/.test(this.context.intl.locale)) {
      return (
        <Panel activeKey={this.state.activeKey} activateKey={this.onKeyChange} itemKey="item_matching_funds" header="Do you accept matching funds from my employer?">
          <p>Yes! We’re registered with most major matching gift portal systems, and would be happy to work with you to get your donation matched by your employer. Please contact us at <a href="mailto:donate@mozilla.org">donate@mozilla.org</a> if you have any questions or need assistance.</p>
        </Panel>
      );
    }
    return (<div></div>);
  },
  renderEnglishMemoLine: function() {
    if (/^(en-US|en-CA)(\b|$)/.test(this.context.intl.locale)) {
      return (
        <span> and include your email address on the memo line.</span>
      );
    }
    return (<div></div>);
  },
  renderRecaptchFaqItem: function() {
    if (process.env.RECAPTCHA_DISABLED) {
      return (<div></div>);
    }
    return (
      <Panel activeKey={this.state.activeKey} activateKey={this.onKeyChange} itemKey="item_19" header={this.context.intl.formatHTMLMessage({id: 'faq_item_19_header'})}>
        <p><FormattedHTMLMessage id='faq_item_19_paragraph_a'/></p>
        <p><FormattedHTMLMessage id='faq_item_19_paragraph_b'/></p>
      </Panel>
    );
  },
  render: function() {
    var className = "row faq-page";
    var activeKey = this.state.activeKey;

    return (
      <div className={className}>
        <div className="faq-header">
          <div className="container">
            <h1><FormattedHTMLMessage id='faq_header'/></h1>
            <Link to={'/' + this.context.intl.locale + '/'}>
              <FormattedHTMLMessage id='faq_donate_link'/>
            </Link>
          </div>
        </div>
        <div className="container">
          <h2>
            <FormattedHTMLMessage id='faq_intro_shorter'/>
          </h2>
          <div className="collapse">

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_1" header={this.context.intl.formatHTMLMessage({id: 'faq_item_1_header'})}>
              <p><FormattedHTMLMessage id='faq_item_1_paragraph'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_2" header={this.context.intl.formatHTMLMessage({id: 'faq_item_2_header'})}>
              <p><FormattedHTMLMessage id='faq_item_2_paragraph_a'/></p>
              <p><FormattedHTMLMessage id='faq_item_2_paragraph_b2'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_3" header={this.context.intl.formatHTMLMessage({id: 'faq_item_3_header'})}>
              <p><FormattedHTMLMessage id='faq_item_3_paragraph_bitcoin'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_4" header={this.context.intl.formatHTMLMessage({id: 'faq_item_4_header_check'})}>
              <p><FormattedHTMLMessage id='faq_item_4_paragraph_a'/></p>
              <address>
                Mozilla Foundation
                <br/>
                331 East Evelyn Avenue,
                <br/>
                Mountain View, CA 94041
                <br/>
                USA
              </address>{this.renderEnglishMemoLine()}
              <br/><br/>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_5" header={this.context.intl.formatHTMLMessage({id: 'faq_item_5_header'})}>
              <p><FormattedHTMLMessage id='faq_item_5_paragraph_b'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_6" header={this.context.intl.formatHTMLMessage({id: 'faq_item_6_header'})}>
              <p><FormattedHTMLMessage id='faq_item_6_paragraph_a_shorter'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_7" header={this.context.intl.formatHTMLMessage({id: 'faq_item_7_header'})}>
              <p><FormattedHTMLMessage id='faq_item_7_paragraph_a_mission'/></p>
              <p><FormattedHTMLMessage id='faq_item_7_paragraph_b'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_8" header={this.context.intl.formatHTMLMessage({id: 'faq_item_8_header'})}>
              <p><FormattedHTMLMessage id='faq_item_8_paragraph_a'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_9" header={this.context.intl.formatHTMLMessage({id: 'faq_item_9_header'})}>
              <p><FormattedHTMLMessage id='faq_item_9_paragraph_foundations'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_10" header={this.context.intl.formatHTMLMessage({id: 'faq_item_10_header'})}>
              <p><FormattedHTMLMessage id='faq_item_10_paragraph'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_tax_a" header={this.context.intl.formatHTMLMessage({id: 'faq_item_tax_header'})}>
              <p><FormattedHTMLMessage id='donation_notice_2'/> <FormattedHTMLMessage id='faq_item_tax_paragraph_a_tax_id'/></p>
              <p><FormattedHTMLMessage id='faq_item_tax_paragraph_b'/></p>
              <p><FormattedHTMLMessage id='faq_item_tax_paragraph_c'/></p>
            </Panel>

            {this.renderEnglishTaxItem()}

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_11" header={this.context.intl.formatHTMLMessage({id: 'faq_item_11_header'})}>
              <p><FormattedHTMLMessage id='faq_item_11_paragraph'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_12" header={this.context.intl.formatHTMLMessage({id: 'faq_item_12_header'})}>
              <p><FormattedHTMLMessage id='faq_item_12_paragraph_currencies'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_13" header={this.context.intl.formatHTMLMessage({id: 'faq_item_13_header'})}>
              <p><FormattedHTMLMessage id='faq_item_13_paragraph'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_14" header={this.context.intl.formatHTMLMessage({id: 'faq_item_14_header'})}>
              <p><FormattedHTMLMessage id='faq_item_14_paragraph'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_15" header={this.context.intl.formatHTMLMessage({id: 'faq_item_15_header'})}>
              <p><FormattedHTMLMessage id='faq_item_15_paragraph'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_16" header={this.context.intl.formatHTMLMessage({id: 'faq_item_16_header'})}>
              <p><FormattedHTMLMessage id='faq_item_16_paragraph'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_17" header={this.context.intl.formatHTMLMessage({id: 'faq_item_17_header'})}>
              <p><FormattedHTMLMessage id='faq_item_17_paragraph'/></p>
            </Panel>

            {this.renderEnglishMatchingFunds()}

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_18" header={this.context.intl.formatHTMLMessage({id: 'faq_item_18_header'})}>
              <p><FormattedHTMLMessage id='faq_item_18_paragraph'/></p>
            </Panel>

            {this.renderRecaptchFaqItem()}
            {this.renderEnglishAmazonSmile()}
          </div>
        </div>
        <MozillaFooter/>
      </div>
    );
  }
});

module.exports = Faq;
