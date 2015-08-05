[![Build Status](https://travis-ci.org/mozilla/donate.mozilla.org.svg?branch=master)](https://travis-ci.org/mozilla/donate.mozilla.org)

# donate.mozilla.org
Mozilla donation forms


## Setup

```
$> npm install
$> cp sample.env .env
```

## To run

```
$> npm start
```

## Localization

In this project we're using [React-Intl](https://github.com/yahoo/react-intl) to localize our application and YAML for translation.

#### Localize a component or page

To localize a component or page you have to include `IntlMixin` in your class `mixins`, for example:

``` typescript
var React = require('react');
var IntlMixin = require('react-intl').IntlMixin;

var Example = React.createClass({
  mixins: [IntlMixin],
  render: function() {
    return (
      <div>
      	<h1>{this.getIntlMessage('key_name_here')}
      </div>
    );
  }

});
```

If the strings include HTML, use the `FormattedHTMLMessage` element:

``` typescript
import { FormattedHTMLMessage, IntlMixin } from 'react-intl';

<FormattedHTMLMessage
  message={ this.getIntlMessage("key_name_here") }
/>
```

Once you add the mixin it will expose `getIntlMessage` method to your component to get the localized message for the given key.

#### Adding locale
Because we are using YAML for our translation and React-Intl expects JSON, we need an extra build step to convert YAML to JSON.
We are using [yaml-intl-xml-json-converter](https://www.npmjs.com/package/yaml-intl-xml-json-converter) to convert from YAML to JSON.

##### config for for YAML to JSON conversion

`intl-config.json`
``` json
{
	"supportedLocales": ["en-US", "de", "fr", "pt-BR", "es"],
	"dest": "locales",
	"src": "locales",
	"type": "json"
}
```

##### YAML template

`en-US.yaml`
``` yaml
---
en-US:
  first: This is your first message
  second: This is your second message
```

You have to make sure you match your language code in your YAML file and the name of the file with what you include in your config file for the converting part otherwise it will fail.

### I18N Methods

`i18n.js` file exposes different methods to help with localization. These are the list of available methods when you required the module.

``` js
{
  intlData,
  defaultLang: 'en-US',
  currentLanguage: locale,
  isSupportedLanguage: function(lang),
  intlDataFor: function(lang)
}
```

1. `intlData`
  This object consist of two properties. `locales` and `messages`. We use this object to pass it to React-Router in order for `getIntlMessage` to work properly.

2. `defaultLang`
  This will return default language of the application.

3. `currentLanguage`
  This will return current language of the client that visiting our site.

4. `isSupportedLanguage`
  This method expect a valid language code, and it's used to validate if we support that given language or not.
  The return value is boolean.

5. `intlDataFor`
  This method expect a valid language code, and it will return `intlData` for the given language.

### How to setup a new A/B test page or form

There are 4 steps to setup a new test page or form:

1. [Add new page or component](#add-new-page-or-component)
2. [Add route](#add-route)
3. [Starting the test](#starting-the-test)
4. [Ending the test](#ending-the-test)

##### Files and directories structure

```
.
├── components
│   ├── footer.jsx
│   ├── header.jsx
├── less
│   ├── components
│   │   ├── footer.less
│   │   ├── header.less
│   │   └── simple-paypal.less
│   ├── pages
│   │   ├── give-bitcoin.less
│   │   └── index.less
│   └── shared.less
├── locales
│   ├── de.json
│   ├── de.yaml
│   ├── en-US.json
│   ├── en-US.yaml
├── pages
│   ├── give-bitcoin.jsx
│   └── thank-you.jsx
├── public
│   ├── exchange-rates
│   │   └── rates-backup.json
│   ├── images
│   │   └── bitcoin_donation_large.png
│   └── js
│       └── stripe.js
├── scripts
│   ├── build.js
│   └── paths.js
├── tests
│   ├── selenium
│   │   └── start.js
│   └── start.js
```

##### Add new page or component

All new components should be added under `components` directory, and page should be under `pages`.

Where possible, we should re-use components across tests.

##### Add route

To add new page to the application you have to edit `routes.jsx` file:

``` typescript
var routes = (
  <Route>
    <Route name="your-route-name" path="/path-to-your-route" handler={require('path-to-your-component.jsx')} />
  </Route>
);
```

See [URL best practices](#url-best-practices).

#### Localization

* New pages should make use of existing strings.
* If new strings are required, these are added to our existing strings.
* New pages will be created for all locales where we currently have strings

#### URL best practices
* The core version of the form should always be our current champion (best performer)
* All links we promote on external properties (snippet, etc) should link to the core version of the form. e.g. donate.mozilla.org
* Routing to temporary test URLs is managed via Optimizely via the core URL
* Tests are run against temporary test URLs
** These URLs are named in ways to identify the test function
** e.g. donate.mozilla.org/visual-background-de
* If the test variation wins, we move the content of this temporary test URL into the core URL 

#### Starting the test

* Deploy the test URLs to production
* Test new URLs are working
* Setup A/B test routing via Optimizely to distribute traffic between the test variations

#### Ending the test
* If one of the test variations is the winner, make this page the default / control page for all visitors
* Remove the temporary test URLs setup for this test
* Traffic to temporary test URLs redirects to the core URLs
** TBC: do we explicitly manage these redirects in code, or do we have a catch-all redirect for our 404 page? 


## Tests

#### Selenium

```
$> npm run test:selenium
```

## Making a test stripe donation

We use [Stripe](https://stripe.com) for our non paypal credit card payments.

Stripe provides a handful of [test credit cards](https://stripe.com/docs/testing#cards).

Example: 4242424242424242 works as a test Visa card number.

## Making a test paypal donation

Local development of the form is by default setup to use a paypal sandbox account.

A test account is also provided and the credentials are:

Username: send-donation@test.com

Password: testtest

## Exchange rates

On our donation thank you page, we record donation amounts using the Optimizely conversion tracking tag so we can see which variations of A/B tests we run result in the most donations.

The Optimizely tracking requires we record the donation amount in USD, but many of our transactions happen in other currencies.

We need to convert these donation amounts into USD dollars. To do this, we periodically fetch an updated set of exchange rate data from openexhangerates.org. We store this as a static file on our server as we want to reduce the number of requests to 3rd party services during page load for our end users (this is good for maintaining control over page load times).

Ideally, we keep these rates up to date, but this is not a business critial data source, so in case of downtime or problems fetching the data, we also store a reasonable snap-shot in `/public/exchangerates/rates-backup.json`.

The build script for the website checks if we have a recent snapshot, and if not creates one. If you are working as a developer on the project, you will need to get an API key from https://openexchangerates.org/signup - the 'Free Forever' plan should be sufficient for development.




