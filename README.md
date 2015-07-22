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

<<<<<<< HEAD
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

## Tests

#### Selenium

For now these commands need to be run in seperate consoles.

```
$> npm start

$> npm test:selenium
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
