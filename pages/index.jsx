import React from 'react';
import Optimizely from '../components/optimizely.jsx';
import OptimizelySubdomain from '../components/optimizelysubdomain.jsx';
import Pontoon from '../components/pontoon.jsx';

var Index = React.createClass({
  render: function() {
    return (
      <html>
        <head>
          <OptimizelySubdomain/>
          <Optimizely/>
          <meta charSet="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <title>donate.mozilla.org | Give to Mozilla Today</title>
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
          <script src="/js/parsley.min.js"></script>
          <script src="https://js.stripe.com/v1/"></script>
          <script src="/js/stripe.js"></script>
          <script src="/js/stripe-checkout.js"></script>
          <script src="/js/ga.js"></script>
          <Pontoon/>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic"/>
          <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" rel="stylesheet"/>
          <link rel="icon" href="/images/favicon.ico" type="image/x-icon"/>
          <link rel="stylesheet" href="/css/index.css"/>
        </head>
        <body>
          <div id="my-app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
          <script src="https://cdn.polyfill.io/v1/polyfill.min.js?features=Intl.~locale.fr,Intl.~locale.pt-BR,Intl.~locale.de,Intl.~locale.id,Intl.~locale.es,Intl.~locale.en-US"></script>
          <script src="/main.js"></script>
        </body>
      </html>
    );
  }
});

module.exports = Index;
