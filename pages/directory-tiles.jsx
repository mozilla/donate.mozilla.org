import React from 'react';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import { IntlMixin, FormattedHTMLMessage } from 'react-intl';
import assign from 'react/lib/Object.assign';

var divStyle = {
  'width': '580px',
  position: 'relative',
  'textAlign': 'center',
  'margin': '0 auto'
};
var textStyle = {
  position: 'absolute',
  'width': '100%',
  'fontSize': '45px',
  'fontWeight': '500',
  'color': 'white',
  'bottom': '0'
};


var rolloverStyle = assign({}, textStyle);
rolloverStyle.bottom = '175px';

var btn = {
  position: 'absolute',
  bottom: '0px',
  border: 'solid white 2px',
  'fontSize': '25px',
  margin: '55px 175px',
  padding: '13px',
  color: 'white',
  'borderRadius': '8px'

};

var giveBitcoin = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    var donateNow = this.getIntlMessage('donate_now');
    return (
      <div className="coinbase-page row">
        <Header>
          <h2>DEV-NOTE: Please make sure the string fits the box below.</h2>
        </Header>
        <div style={divStyle}>
          <img src="/tiles-images/v1.png" />
          <h2 style={textStyle}><FormattedHTMLMessage message={this.getIntlMessage('maker_firefox')}/></h2>
        </div>
        <div style={divStyle}>
          <img src="/tiles-images/v2.png" />
          <h2 style={textStyle}>{this.getIntlMessage('support_mozilla')}</h2>
        </div>
        <div style={divStyle}>
          <img src="/tiles-images/rollover.png" />
          <h2 style={rolloverStyle}>{this.getIntlMessage('give_before_31')}</h2>
          <div style={btn}>
            {donateNow}
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
});

module.exports = giveBitcoin;
