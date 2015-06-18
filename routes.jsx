var React = require('react');
var Route = require('react-router').Route;
var paths = require('./paths.js');
var currencies = require('./currencies.js').paths;
var pathsArray = Object.keys(paths).concat(currencies);

/*

    {
      Object.keys(paths).map(function(key) {
console.log(paths[key]);
        return (
          <Route key={key} name={paths[key].name} handler={paths[key].handler} path={paths[key].path} />
        );
      })
    }
*/

var routes = (
  <Route>
    <Route name="sequential" path="/?" handler={require('./pages/sequential.jsx')} />
    <Route name="thank-you" path="/thank-you/?" handler={require('./pages/thank-you.jsx')} />
    <Route name="share" path="/share/?" handler={require('./pages/share.jsx')} />
    <Route name="paypal-donate" path="/paypal-donate-:currency/?" handler={require('./pages/paypal-donate.jsx')} />
  </Route>
);

module.exports = {
  paths: pathsArray,
  routes: routes
};
