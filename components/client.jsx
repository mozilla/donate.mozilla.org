import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import { createHistory } from 'history';
import routes from './routes.jsx';
import queryParser from '../scripts/queryParser.js';
import langURLParser from '../scripts/langURLParser.js';

function createElement(Component, props) {
  var queryString = props.location.query;
  return (
    <Component {...queryParser(queryString, props.location.pathname)} {...props}/>
  );
}

function onEnter(nextState, replaceState) {
  var pathname = langURLParser(nextState.location);
  if (pathname) {
    replaceState({}, pathname);
  }
}

ReactDOM.render(
  <Router createElement={createElement} history={createHistory()}>
    <Route onEnter={onEnter}>
      {routes}
    </Route>
  </Router>,
  document.querySelector("#my-app")
);
