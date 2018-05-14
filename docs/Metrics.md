# Metrics

1. [Instrumentation (Google Analytics)](#instrumentation-google-analytics)
2. [A/B Testing](#ab-testing)
3. [Exchange Rates](#exchange-rates)


## Instrumentation (Google Analytics)

We load Google Analytics on all of our donate web pages, via [index.jsx](https://github.com/mozilla/donate.mozilla.org/blob/master/pages/index.jsx). We're using the standard [Universal Analytics](https://support.google.com/analytics/answer/2790010?hl%3Den) tracking tag, which gives us default data about pageviews [code](https://github.com/mozilla/donate.mozilla.org/blob/master/pages/index.jsx).

We also want to track some additional information specific to our fundraising so we can measure the impact of our campaigns and efforts.

### Revenue Goal Tracking

[analytics.js](https://github.com/mozilla/donate.mozilla.org/blob/master/assets/js/analytics.js) is loaded on all of our 'thank you' pages, after a donation is complete. In this file we look for URL parameters provided by our various payment providers to extract:

* `transaction id`
* `donation amount`
* `currency code`
* `frequency` < One-off or Monthly

We then use these values to record a [Google Analytics Ecommerce Event](https://developers.google.com/analytics/devguides/collection/gajs/gaTrackingEcommerce).

### Virtual Pageviews

Some of our donation forms are 'sequential', where the user completes one step at a time. Because we have built this user flow using JavaScript, the whole interaction happens without changing the URL the user is on. In this scenario, Google Analytics doesn't know the user has moved between multiple virtual pages unless we fire specific tracking events.

When tracking GA events in React, we use our own library [react-ga](https://github.com/mozilla/react-ga/).

e.g.

```js
  var reactGA = require('react-ga');

  ...

  showPage: function(page) {
    ...

    var currentPage = window.location.pathname;
    reactGA.pageview(currentPage + page);
  }
```


## A/B Testing

* [Wikipedia: Conversion Rate Optimization](https://en.wikipedia.org/wiki/Conversion_rate_optimization)

### Intro to Traffic Cop

* We are in the process of implementing [Traffic Cop](https://github.com/mozilla/trafficcop) to run our A/B testing experiments.

### Types of tests

Typically, A/B tests fall into one of two categories:

1. A significant change to a form or page, which is tested by creating multiple variations of the page and using Optimizely to distribute a % of visitors to each variation. This new page is commited to the repo and deployed *before* the test begins.
2. A smaller content change on an existing page (say changing some text or moving a button), which is tested by editing the content at load time using Optimizely, *without* commiting any new code to the repo.

In both cases, once a test has concluded and a winner has been found. The winner is commited to the repo as the new default and deployed.

### How to setup a new A/B test for a significantly different page or form

There are 4 steps to setup a new page or form for a test:

1. [Add new page or component](#add-new-page-or-component)
2. [Add route](#add-route)
3. [Starting the test](#starting-the-test)
4. [Ending the test](#ending-the-test)


#### Add new page or component

All new components should be added under the `components` directory, and pages should be under `pages`.

Where possible, we should re-use components across tests.

#### Add route

To add new page to the application you have to edit `routes.jsx` file:

``` typescript
var routes = (
  <Route>
    <Route name="your-route-name" path="/path-to-your-route" handler={require('path-to-your-component.jsx')} />
  </Route>
);
```

##### Further notes about adding new test pages

###### Localization

* New pages should make use of existing strings
* If new strings are required, these are added to our existing strings
* New pages will be created for all locales where we currently have strings, even if we only run the test in one locale

##### URL best practices

* The root URL for our donation site should always show be our current [champion]() (best performer)
* All links we promote on external properties (snippet, etc) should link to the core version of the form. e.g. donate.mozilla.org
* Routing to temporary test URLs is managed via Optimizely via the core URL
* Tests are run against temporary test URLs
** These URLs are named in ways to identify the test function
** e.g. donate.mozilla.org/visual-background-de
* If the test variation wins, we move the content of this temporary test URL into the core URL

#### Starting the test

* Deploy the test URLs to production
* Check the new URLs are working
* Setup A/B test routing via Optimizely to distribute traffic between the test variations

#### Ending the test
* If one of the test variations is the winner, make this page the default / control page for all visitors by updating the default route in `routes.jsx`
* Remove the temporary test URLs setup for this test
* Traffic to temporary test URLs now redirects to the core URLs (in case old links persist online)
** TBC: do we explicitly manage these redirects in code, or do we have a catch-all redirect for our 404 page?


## Exchange rates

On our donation thank you page, we record donation amounts using the Optimizely conversion tracking tag so we can see which variations of A/B tests we run result in the most donations.

The Optimizely tracking requires we record the donation amount in USD, but many of our transactions happen in other currencies.

We need to convert these donation amounts into USD dollars. To do this, we periodically fetch an updated set of exchange rate data from openexhangerates.org. We store this as a static file on our server as we want to reduce the number of requests to 3rd party services during page load for our end users (this is good for maintaining control over page load times).

Ideally, we keep these rates up to date, but this is not a business critial data source, so in case of downtime or problems fetching the data, we also store a reasonable snap-shot in `/public/exchangerates/rates-backup.json`.

The build script for the website checks if we have a recent snapshot, and if not creates one. If you are working as a developer on the project, you will need to get an API key from https://openexchangerates.org/signup - the 'Free Forever' plan should be sufficient for development.

See code for exchange rates:

* https://github.com/mozilla/donate.mozilla.org/blob/master/scripts/exchangerates.js
* https://github.com/mozilla/donate.mozilla.org/blob/master/assets/js/analytics.js#L87-L113
