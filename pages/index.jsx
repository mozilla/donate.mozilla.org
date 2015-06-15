var React = require('react');

var Index = React.createClass({
  render: function() {
    return (
      <html>
        <head>
          <meta charSet="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <title>donate.mozilla.org | Give to Mozilla Today</title>
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
          <script src="https://sendto.mozilla.org/page/-/donation_form/js/parsley.min.js"></script>
          <script src="public/js/ga.js"></script>
          <script src="//s.bsd.net/bsdaction/default/page/-/js/analytics/ga_integration-min.js"></script>
          <script src="https://js.stripe.com/v1/"></script>
          <script src="public/js/stripe.js"></script>
          <script src="public/js/analytics.js"></script>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic"/>
          <link href="https://sendto.mozilla.org/page/-/donation_form/css/font-awesome.min.css" rel="stylesheet"/>
          <link rel="icon" href="https://sendto.mozilla.org/page/-/donation_form/img/favicon.ico" type="image/x-icon"/>
          <link rel="stylesheet" href="public/css/index.css"/>
        </head>
        <body>
          <div id="my-app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
          <script src="public/build/main.js"></script>
        </body>
      </html>
    );
  }
});

module.exports = Index;
