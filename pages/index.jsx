import fs from 'fs';
import React from 'react';
import Optimizely from '../components/optimizely.jsx';
import OptimizelySubdomain from '../components/optimizelysubdomain.jsx';
import Path from 'path';
import Pontoon from '../components/pontoon.jsx';

var Index = React.createClass({
  render: function() {
    var metaData = this.props.metaData;
    var robots = 'index, follow';
    var googleFonts = "https://fonts.googleapis.com/css?family=Open+Sans:600,400,300,300italic";
    if (this.props.localeInfo === "cs") {
      googleFonts += "&subset=latin-ext";
    }
    if (metaData.current_url.indexOf('thank-you') !== -1) {
      robots = 'noindex, nofollow';
    }
    var fileHashes = JSON.parse(fs.readFileSync(Path.join(__dirname, '../public/webpack-assets.json')));
    var ga = `
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      ga('create', 'UA-49796218-32', 'auto');
      ga('send', 'pageview');
    `;

    return (
      <html>
        <head>
          <meta charSet="UTF-8"/>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta name='robots' content={robots}/>
          <meta property="og:type" content="website" />
          <meta property="og:title" content={metaData.title} />
          <meta property="og:site_name" content={metaData.site_name} />
          <meta property="og:url" content={metaData.site_url} />
          <meta property="og:description" content={metaData.desc} />
          <meta property="og:image" content={metaData.facebook_image} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@mozilla" />
          <meta name="twitter:title" content={metaData.title} />
          <meta name="twitter:description" content={metaData.desc} />
          <meta name="twitter:image" content={metaData.twitter_image} />

          <link rel="preconnect" href="https://www.google-analytics.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link rel="preconnect" href="https://206878104.log.optimizely.com" />
          <title>donate.mozilla.org | {metaData.site_title}</title>
          <OptimizelySubdomain/>
          <Optimizely/>
          <link rel="icon" href={this.props.favicon} type="image/x-icon"/>
          <link rel="stylesheet" href={'/' + fileHashes.main.css}/>
           <script dangerouslySetInnerHTML={{__html: ga}}></script>
        </head>
        <body>
          <div id="my-app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
          <link rel="stylesheet" href={googleFonts}/>
          <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" rel="stylesheet"/>
          <script src={'/api/polyfill.js?features=Event,CustomEvent,Promise,Intl.~locale.' + this.props.localeInfo}></script>
          <script src={'/' + fileHashes.main.js} ></script>
          <Pontoon/>
          <script src="https://checkout.stripe.com/checkout.js"></script>
        </body>
      </html>
    );
  }
});

module.exports = Index;
