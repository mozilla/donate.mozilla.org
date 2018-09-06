import React from 'react';
import MozillaFooter from '../components/mozilla/footer.js';
import Nav from '../components/nav.js';
import SingleForm from '../components/single-form.js';
import { FormattedHTMLMessage } from 'react-intl';

module.exports = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      aboutCopy: null
    };
  },
  componentDidMount: function() {
    var additionalInfoId = 'additional_info_internet_health';
    if (/^(en)(\b|$)/.test(this.context.intl.locale)) {
      additionalInfoId = 'additional_info_internet_health_bold';
    }
    var aboutCopy = (<span><FormattedHTMLMessage id={additionalInfoId}/></span>);

    this.setState({
      aboutCopy: aboutCopy
    });
  },
  imageTest: function() {
    let test = this.props.test;

    if (test === "img-a") {
      return (<picture>
        <source width="1448" srcSet="/assets/images/homepage-images/teacher-wide.jpg" media="(max-width: 799px)" />
        <img className="homepage-image" src="/assets/images/homepage-images/teacher-full.jpg" alt="Man pointing at student's computer screen"/>
      </picture> );
    }
    if (test === "img-b") {
      return (<picture>
        <source srcSet="/assets/images/homepage-images/believe-wide.jpg" media="(max-width: 799px)" />
        <img className="homepage-image" src="/assets/images/homepage-images/believe-full.jpg" alt="A sign that reads 'I believe in the open Internet'"/>
      </picture>);
    }
    return (<img className="homepage-image icon-baseline" height="100" width="107" alt="heart" src="/assets/images/heart.ce7d2d59c757e1598e244e546426577c.svg"/>);
  },
  renderTextAboutPage: function() {
    return (
      <div className="container additional-page">
        { this.imageTest() }
        <div>
          { this.state.aboutCopy }
        </div>
      </div>
    );
  },
  renderNav: function() {
    return (
      <Nav zenMode={true} simpleBackground={true}/>
    );
  },
  render: function() {
    var className = "row additional-info-container";

    var additionalInfo = this.renderTextAboutPage();

    return (
      <div>
        {this.renderNav()}
        <div className={className}>
          <div className="additional-info-page">
            { additionalInfo }
            <SingleForm
              subscribed={this.props.subscribed}
              currency={this.props.currency}
              presets={this.props.presets}
              amount={this.props.amount}
              frequency={this.props.frequency}
              country={this.props.country}
            />
          </div>
          <MozillaFooter/>
        </div>
      </div>
    );
  }
});
