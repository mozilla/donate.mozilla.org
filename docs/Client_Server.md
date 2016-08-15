# Client and Server

## Precompile

Server side we precompile all our React components into static HTML.

Use the `npm install` command to trigger or update the precompile.

### Webpack

In our webpack.config file, we create static HTML pages from a list of react routes.

First we get an array of all our paths from `/src/lib/paths.js`.

`/src/lib/paths.js` starts with basic pages from `/src/data/pages.js`.

`/src/data/pages.js` is a simple list of pages, it doesn't deal with locale or currency pages. `/src/lib/paths.js` then compiles a list of all possible paths based on our pages.

Webpack then uses `/src/lib/simple-html-plugin.js` to turn those paths into static HTML files.

`/src/lib/simple-html-plugin.js` calls `/src/lib/route-file-content.js` for each path, building in locale and currency data, and writting the resulting HTML from `renderToStaticMarkup` to file.

### Babel

We run all our source files through babel-cli from an npm script. This takes all the files in `/src/`, runs them through babel-cli, and drops them into `/dist/`.

This way we only need to run Babel once, Webpack and the server can then run the files the same, without needing to run babel separately in webpack and node.

## React Client Side

Once the static page is served up, React checks for any changes, it shouldn't find any, and should do nothing. From here React works as normal.

### Client.js

`/lib/client.js` is our client side entry point and is the only react component that doesn't get rendered server side. We mostly use this for client side routing.

So once the initial page is rendered, client side changes for say locale or currency just renders the difference without making another http request.

## Universal JavaScript

In order to precompile the HTML, we need to render all React components server side. This means render needs to work both client side and server side. The server does not run something like `componentDidMount` or `onClick`, nor does it render `client.js`.

### React Router

React Router is used both client side and server side. This is because render fails if it encounters a route that it's not aware of. Handing the server side a list of routes gives it knowledge of this so it knows what is a valid route, and what is a typo or error in a route.
