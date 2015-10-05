import React from 'react';
import Optimizely from '../components/optimizely.jsx';
import OptimizelySubdomain from '../components/optimizelysubdomain.jsx';
import Pontoon from '../components/pontoon.jsx';

var Index = React.createClass({
  render: function() {
    var metaData = this.props.metaData;
    var googleFonts = "https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic";
    if (this.props.localeInfo === "cs") {
      googleFonts += "&subset=latin-ext";
    }
    return (
      <html>
        <head>
          <meta charSet="UTF-8"/>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta property="og:title" content={metaData.title} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content={metaData.site_name} />
          <meta property="og:url" content={metaData.site_url} />
          <meta property="og:description" content={metaData.desc} />
          <title>donate.mozilla.org | {metaData.site_title}</title>
          <OptimizelySubdomain/>
          <Optimizely/>
          <link rel="stylesheet" href={googleFonts}/>
          <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" rel="stylesheet"/>
          <link rel="icon" href="/images/favicon.ico" type="image/x-icon"/>
          <link rel="stylesheet" href="/css/index.css"/>
        </head>
        <body>
          <div id="my-app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
          <script src="https://cdn.polyfill.io/v1/polyfill.min.js?features=Promise,Intl.~locale.fr,Intl.~locale.pt-BR,Intl.~locale.de,Intl.~locale.id,Intl.~locale.es,Intl.~locale.en-US"></script>
          <script src="/main.js"></script>
          <Pontoon/>
          {/*[if lt IE 10]*/}
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/placeholders/4.0.1/placeholders.jquery.js"></script>
          {/*[endif]*/}
          <script src="https://js.stripe.com/v1/"></script>
          <script src="https://checkout.stripe.com/checkout.js"></script>
          <script src="/js/ga.js"></script>
        </body>
      </html>
    );
  }
});

module.exports = Index;
