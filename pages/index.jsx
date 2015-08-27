var React = require('react');

var Habitat = require('habitat');
Habitat.load();
var env = new Habitat();

var cookieDomain = env.get('FULL_SUBDOMAIN_FOR_COOKIE');

var Index = React.createClass({
  render: function() {
    return (
      <html>
        <head>
          <script>
            window['optimizely'] = window['optimizely'] || [];
            window['optimizely'].push(["setCookieDomain", {{cookieDomain}}]);
          </script>
          <script src="https://cdn.optimizely.com/js/206878104.js"></script>
          <meta charSet="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <title>donate.mozilla.org | Give to Mozilla Today</title>
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
          <script src="/js/parsley.min.js"></script>
          <script src="https://js.stripe.com/v1/"></script>
          <script src="/js/stripe.js"></script>
          <script src="/js/ga.js"></script>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic"/>
          <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" rel="stylesheet"/>
          <link rel="icon" href="/images/favicon.ico" type="image/x-icon"/>
          <link rel="stylesheet" href="/css/index.css"/>
        </head>
        <body>
          <div id="my-app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
          <script src="/main.js"></script>
        </body>
      </html>
    );
  }
});

module.exports = Index;
