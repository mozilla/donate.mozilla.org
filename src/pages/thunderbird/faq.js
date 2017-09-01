import React  from 'react';
import MozillaFooter from '../../components/mozilla/footer.js';
import Link from '../../components/link.js';
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
    if (/^(en)(\b|$)/.test(this.context.intl.locale)) {
      return (
        <Panel activeKey={this.state.activeKey} activateKey={this.onKeyChange} itemKey="item_tax_b" header="How can I get a receipt for U.S. tax preparation purposes?">
          <p>If you give to Thunderbird through an online form, you should immediately receive an emailed receipt for your donation that you can use for your U.S. tax preparation purposes. Check your spam folder if you don’t see that email arrive in your email inbox, as it can sometimes be caught by spam filters. If you need an additional copy of your receipt for you for your U.S. tax preparation purposes, please contact us at <a href="mailto:donate@mozilla.org">donate@mozilla.org</a>.</p>
        </Panel>
      );
    }
    return (<div></div>);
  },
  render: function() {
    var className = "row faq-page";
    if (this.props.test) {
      className += " " + this.props.test;
    }
    var activeKey = this.state.activeKey;
    return (
      <div className={className}>
        <div className="faq-header">
          <div className="container">
            <h1><FormattedHTMLMessage id='faq_header'/></h1>
            <Link to={'/' + this.context.intl.locale + '/thunderbird'}>
              <FormattedHTMLMessage id='faq_donate_link'/>
            </Link>
          </div>
        </div>
        <div className="container">
          <h2>
            <FormattedHTMLMessage id='faq_intro_thunderbird'/>
          </h2>
          <div className="collapse">

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_1" header={this.context.intl.formatHTMLMessage({id: 'faq_item_1_header'})}>
              <p><FormattedHTMLMessage id='faq_item_1_paragraph_thunderbird'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_2" header={this.context.intl.formatHTMLMessage({id: 'faq_item_2_header_thunderbird'})}>
              <p><FormattedHTMLMessage id='faq_item_2_p_thunderbird_a'/></p>
              <p><FormattedHTMLMessage id='faq_item_2_p_thunderbird_b'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_3" header={this.context.intl.formatHTMLMessage({id: 'faq_item_3_header'})}>
              <p><FormattedHTMLMessage id='faq_item_3_paragraph_thunderbird'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_4" header={this.context.intl.formatHTMLMessage({id: 'faq_item_4_header'})}>
              <p><FormattedHTMLMessage id='faq_item_4_paragraph_a_thunderbird'/></p>
              <address>
                Thunderbird at Mozilla Foundation
                <br/>
                331 East Evelyn Avenue,
                <br/>
                Mountain View, CA 94041
                <br/>
                USA
              </address>
              <p><FormattedHTMLMessage id='faq_item_4_paragraph_h_thunderbird'/></p>
              <p><FormattedHTMLMessage id='faq_item_4_paragraph_f_thunderbird'/></p>
              <p><FormattedHTMLMessage id='faq_item_4_paragraph_g'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_5" header={this.context.intl.formatHTMLMessage({id: 'faq_item_5_header'})}>
              <p><FormattedHTMLMessage id='faq_item_5_paragraph_thunderbird'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_6" header={this.context.intl.formatHTMLMessage({id: 'faq_item_6_header_thunderbird'})}>
              <p><FormattedHTMLMessage id='faq_item_6_paragraph_a_thunderbird'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_7" header={this.context.intl.formatHTMLMessage({id: 'faq_item_7_header'})}>
              <p><FormattedHTMLMessage id='faq_item_7_paragraph_a_thunderbird'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_8" header={this.context.intl.formatHTMLMessage({id: 'faq_item_8_header_thunderbird'})}>
              <p><FormattedHTMLMessage id='faq_item_8_paragraph_a_thunderbird'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_9" header={this.context.intl.formatHTMLMessage({id: 'faq_item_9_header_thunderbird'})}>
              <p><FormattedHTMLMessage id='faq_item_9_paragraph_thunderbird'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_10" header={this.context.intl.formatHTMLMessage({id: 'faq_item_10_header'})}>
              <p><FormattedHTMLMessage id='faq_item_10_paragraph_thunderbird'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_tax_a" header={this.context.intl.formatHTMLMessage({id: 'faq_item_tax_header'})}>
              <p><FormattedHTMLMessage id='donation_notice'/> <FormattedHTMLMessage id='faq_item_tax_paragraph_a_tax_id'/></p>
              <p><FormattedHTMLMessage id='faq_item_tax_paragraph_b'/></p>
              <p><FormattedHTMLMessage id='faq_item_tax_paragraph_c'/></p>
            </Panel>

            {this.renderEnglishTaxItem()}

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_11" header={this.context.intl.formatHTMLMessage({id: 'faq_item_11_header'})}>
              <p><FormattedHTMLMessage id='faq_item_11_paragraph_thunderbird'/></p>
            </Panel>

            <Panel activeKey={activeKey} activateKey={this.onKeyChange} itemKey="item_15" header={this.context.intl.formatHTMLMessage({id: 'faq_item_15_header'})}>
              <p><FormattedHTMLMessage id='faq_item_15_paragraph_thunderbird'/></p>
            </Panel>
          </div>
        </div>
        <MozillaFooter/>
      </div>
    );
  }
});

module.exports = Faq;
