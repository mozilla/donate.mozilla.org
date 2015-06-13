var React = require('react');

var Index = React.createClass({
  render: function() {
    return (
      <html>
        <head>
          <meta charSet="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <title>donate.mozilla.org</title>
          <link rel="stylesheet" href="public/css/index.css"/>
        </head>
        <body>
          <div id="my-app">{this.props.markup}</div>
          <script src="public/build/main.js"></script>
        </body>
      </html>
    );
  }
});

module.exports = Index;
