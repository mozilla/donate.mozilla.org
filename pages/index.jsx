var React = require('react');

var Index = React.createClass({
  render: function() {
    return (
      <html>
        <head>
          <script src="//cdn.optimizely.com/js/206878104.js"></script>
          <meta charSet="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <title>donate.mozilla.org | Give to Mozilla Today</title>
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
          <script src="https://sendto.mozilla.org/page/-/donation_form/js/parsley.min.js"></script>
          <script src="https://js.stripe.com/v1/"></script>
          <script src="/js/stripe.js"></script>
          <script src="/js/ga.js"></script>
          <script src="/js/analytics.js"></script>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic"/>
          <link href="https://sendto.mozilla.org/page/-/donation_form/css/font-awesome.min.css" rel="stylesheet"/>
          <link rel="icon" href="https://sendto.mozilla.org/page/-/donation_form/img/favicon.ico" type="image/x-icon"/>
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
