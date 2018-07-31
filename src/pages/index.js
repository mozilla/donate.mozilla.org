import fs from 'fs';
import React from 'react';
import Path from 'path';
import Pontoon from '../components/pontoon.js';

var Index = React.createClass({
  render: function() {
    var metaData = this.props.metaData;
    var robots = 'index, follow';
    var googleFonts = "https://fonts.googleapis.com/css?family=Nunito+Sans:600,400,300,700,300italic|Zilla+Slab:300,700";
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
          <title>donate.mozilla.org | {metaData.site_title}</title>
          <link rel="icon" href={this.props.favicon} type="image/x-icon"/>
          <link rel="stylesheet" href={'/' + fileHashes.main.css}/>
          <script src="/api/client-env.js"></script>
          <script src="/assets/js/mozilla-traffic-cop.js"></script>
          <script src="/assets/js/ga.js"></script>
          <script src="/assets/js/ab-tests.js"></script>
          <script async src={"https://www.google.com/recaptcha/api.js?render=explicit&hl=" + this.props.locale}></script>
          {
            localesData.map((localeData, index) => {
              return (
                <script key={"localeData-" + index} dangerouslySetInnerHTML={{__html: localeData}}></script>
              );
            })
          }
        </head>
        <body>
          <div id="g-recaptcha"></div>
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
