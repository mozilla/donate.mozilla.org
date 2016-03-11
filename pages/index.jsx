import fs from 'fs';
import React from 'react';
import Optimizely from '../components/optimizely.jsx';
import OptimizelySubdomain from '../components/optimizelysubdomain.jsx';
import Path from 'path';
import Pontoon from '../components/pontoon.jsx';

var Index = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  propTypes: {
    favicon: React.PropTypes.string.isRequired,
    metaData: React.PropTypes.object.isRequired,
    children: React.PropTypes.any
  },
  render: function() {
    var metaData = this.props.metaData;
    var robots = 'index, follow';
    var googleFonts = "https://fonts.googleapis.com/css?family=Open+Sans:600,400,300,300italic";
    var fileHashes = JSON.parse(fs.readFileSync(Path.join(__dirname, '../public/webpack-assets.json')));
    var ga = `
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      ga('create', 'UA-49796218-32', 'auto');
      ga('send', 'pageview');
    `;

    if (this.context.intl.locale === "cs") {
      googleFonts += "&subset=latin-ext";
    }
    if (metaData.current_url.indexOf('thank-you') !== -1) {
      robots = 'noindex, nofollow';
    }

    return (
      <html>
        <head>
          <meta charSet="UTF-8"/>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta name='robots' content={robots}/>
          <meta property="og:type" content="website" />
          <meta property="og:title" content={this.context.intl.formatMessage({id: 'support_mozilla'})} />
          <meta property="og:site_name" content={metaData.site_name} />
          <meta property="og:url" content={metaData.site_url} />
          <meta property="og:description" content={this.context.intl.formatMessage({id: 'i_donated_to_mozilla'})} />
          <meta property="og:image" content={`${metaData.APPLICATION_URI}/assets/images/EOY_facebook_v1.a152496406bad899d1a920f6d6b9f507.png`} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@mozilla" />
          <meta name="twitter:title" content={this.context.intl.formatMessage({id: 'support_mozilla'})} />
          <meta name="twitter:description" content={this.context.intl.formatMessage({id: 'i_donated_to_mozilla'})} />
          <meta name="twitter:image" content={`${metaData.APPLICATION_URI}/assets/images/EOY_Twitter_v8_EN.d1bb5d2a5ce35859d038df852d9e6a0a811beaac.png`} />

          <link rel="preconnect" href="https://www.google-analytics.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link rel="preconnect" href="https://206878104.log.optimizely.com" />
          <title>{`donate.mozilla.org | ${this.context.intl.formatMessage({id: 'give_to_mozilla'})}`}</title>
          <OptimizelySubdomain/>
          <Optimizely/>
          <link rel="icon" href={this.props.favicon} type="image/x-icon"/>
          <link rel="stylesheet" href={`/${fileHashes.main.css}`}/>
           <script dangerouslySetInnerHTML={{__html: ga}}></script>
        </head>
        <body>
          <script src={`/intl/data/${this.context.intl.locale}.js`}></script>
          <div id="my-app">
            {this.props.children[0][1]}
          </div>
          <link rel="stylesheet" href={googleFonts}/>
          <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" rel="stylesheet"/>
          <script src={`/api/polyfill.js?features=Event,CustomEvent,Promise,Intl.~locale.${this.context.intl.locale}`}></script>
          <script src={`/${fileHashes.main.js}`} ></script>
          <Pontoon/>
          <script src="https://checkout.stripe.com/checkout.js"></script>
        </body>
      </html>
    );
  }
});

module.exports = Index;
