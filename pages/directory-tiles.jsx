import React from 'react';
import MozillaFooter from '../components/mozilla/footer.jsx';
import Header from '../components/header.jsx';
import { FormattedHTMLMessage } from 'react-intl';
import assign from 'react/lib/Object.assign';

var divStyle = {
  'width': '580px',
  position: 'relative',
  'textAlign': 'center',
  'margin': '0 auto',
  'paddingBottom': '10px'
};
var textStyle = {
  position: 'absolute',
  'width': '100%',
  'fontSize': '55px',
  'fontWeight': '500',
  'color': 'white',
  'bottom': '45%'
};


var rolloverStyle = assign({}, textStyle);
rolloverStyle.bottom = '175px';

var btn = {
  position: 'absolute',
  bottom: '0px',
  border: 'solid white 2px',
  'fontSize': '25px',
  margin: '55px 200px',
  padding: '13px',
  color: 'white',
  'borderRadius': '8px'
};

var red = {
  color: '#CB5136'
};
var darkRed = {
  color: '#893930'
};

var heartClassName = 'fa fa-heart';
var heart = {
  red: (<i style={red} className={heartClassName}></i>),
  darkRed: (<i style={darkRed} className={heartClassName}></i>)
};

var DirectoryTiles = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    var donateNow = this.context.intl.formatMessage({id: 'donate_now'});
    return (
      <div className="coinbase-page row">
        <Header>
          <h2>DEV-NOTE: Please make sure the string fits the box below.</h2>
        </Header>
        <div style={divStyle}>
          <img src="/assets/tiles/eoy01.png" />
          <h2 style={textStyle}><FormattedHTMLMessage redHeart={heart.red} id='red_heart_the_web' /></h2>
        </div>
        <div style={divStyle}>
          <img src="/assets/tiles/eoy02.png" />
          <h2 style={textStyle}>{this.context.intl.formatMessage({id: 'give_before_31'})}</h2>
        </div>
        <div style={divStyle}>
          <img src="/assets/tiles/eoy03.png" />
          <h2 style={textStyle}><FormattedHTMLMessage darkRedHeart={heart.darkRed} id='darkRed_heart_the_web' /></h2>
        </div>
        <div style={divStyle}>
          <img src="/assets/tiles/eoy04.png" />
          <h2 style={textStyle}>{this.context.intl.formatMessage({id: 'give_before_31'})}</h2>
          <div style={btn}>
            {donateNow}
          </div>
        </div>
        <div style={divStyle}>
          <img src="/assets/tiles/eoy05.png" />
          <h2 style={textStyle}><FormattedHTMLMessage redHeart={heart.red} id='red_heart_mozilla' /></h2>
        </div>
        <div style={divStyle}>
          <img src="/assets/tiles/eoy06.png" />
          <h2 style={textStyle}>{this.context.intl.formatMessage({id: 'give_before_31'})}</h2>
        </div>
        <div style={divStyle}>
          <img src="/assets/tiles/eoy07.png" />
          <h2 style={textStyle}><FormattedHTMLMessage redHeart={heart.red} id='red_heart_mozilla' /></h2>
          <div style={btn}>
            {donateNow}
          </div>
        </div>
        <div style={divStyle}>
          <img src="/assets/tiles/eoy08.png" />
          <h2 style={textStyle}>{this.context.intl.formatMessage({id: 'give_before_31'})}</h2>
        </div>
        <div style={divStyle}>
          <img src="/assets/tiles/eoy09.png" />
          <h2 style={rolloverStyle}>{this.context.intl.formatMessage({id: 'support_mozilla'})}</h2>
        </div>
        <div style={divStyle}>
          <img src="/assets/tiles/eoy10.png" />
          <h2 style={rolloverStyle}>{this.context.intl.formatMessage({id: 'give_before_31'})}</h2>
          <div style={btn}>
            {donateNow}
          </div>
        </div>
        <MozillaFooter/>
      </div>
    );
  }
});

module.exports = DirectoryTiles;
