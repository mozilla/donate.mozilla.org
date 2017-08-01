import fs from 'fs';
import React from 'react';
import Optimizely from '../components/optimizely.js';
import OptimizelySubdomain from '../components/optimizelysubdomain.js';
import Path from 'path';
import Pontoon from '../components/pontoon.js';

var Index = React.createClass({
  render: function() {
    var metaData = this.props.metaData;
    var robots = 'index, follow';
    var googleFonts = "https://fonts.googleapis.com/css?family=Open+Sans:600,400,300,300italic";
    if (metaData.current_url.indexOf("jan-thank-you") !== -1) {
      googleFonts = "https://fonts.googleapis.com/css?family=Roboto+Slab:600,400,300,200,100";
    }

    var localesData = [];
    if (this.props.localesInfo.length) {
      this.props.localesInfo.forEach(function(locale) {
        if (locale === "cs") {
          googleFonts += "&subset=latin-ext";
        }
        localesData.push(fs.readFileSync(Path.join(__dirname, '../../node_modules/react-intl/locale-data/' + locale.split('-')[0] + '.js'), 'utf8'));
      });
    }
    if (metaData.current_url.indexOf('thank-you') !== -1) {
      robots = 'noindex, nofollow';
    }
    var fileHashes = JSON.parse(fs.readFileSync(Path.join(__dirname, '../../public/webpack-assets.json')));
    var ga = `
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      ga('create', 'UA-49796218-32', 'auto');
      ga('send', 'pageview');
    `;
    var polyfillLocale = "";
    if (this.props.locale) {
      polyfillLocale = '&locale=' + this.props.locale;
    }
    var dir = 'ltr';
    if (['ar', 'fa', 'he', 'ur'].indexOf(this.props.locale) >= 0) {
      dir = 'rtl';
    }
    return (
      <html dir={dir} lang={this.props.locale}>
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
          {
            localesData.map((localeData, index) => {
              return (
                <script key={"localeData-" + index} dangerouslySetInnerHTML={{__html: localeData}}></script>
              );
            })
          }
        </head>
        <body>
          <div id="my-app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
          <link rel="stylesheet" href={googleFonts}/>
          <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" rel="stylesheet"/>
          <script src={'/api/polyfill.js?features=Event,CustomEvent,Promise' + polyfillLocale}></script>
          <script src={'/' + fileHashes.main.js} ></script>
          <Pontoon/>
          <script src="https://checkout.stripe.com/checkout.js"></script>
          <script src="https://c.shpg.org/352/sp.js"></script>
        </body>
      </html>
    );
  }
});

module.exports = Index;
