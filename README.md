[![Build Status](https://travis-ci.org/mozilla/donate.mozilla.org.svg?branch=master)](https://travis-ci.org/mozilla/donate.mozilla.org)

# donate.mozilla.org
Mozilla donation forms

* Staging: https://donate.mofostaging.net/en-US/
* Production (temp URL): https://donate.mofoprod.net/

## Requirements

[node](https://nodejs.org/) with [`Intl` support](https://github.com/joyent/node/wiki/Intl).  To test if you have `Intl` support:

```
$> node -e "require('Intl')"
```

## Setup

```
$> npm install
$> cp sample.env .env
```

## To run

```
$> npm start
```

## Documentation

- [Deployment](docs/Deployment.md)
- [Browser Support](docs/Browser_Support.md)
- [QA Checklist](docs/QA_Checklist.md)
- [Support](docs/Support.md)
- [Metrics & A/B Testing](docs/Metrics.md)
- [Client and Server](docs/Client_Server.md)
- [Donation Components](docs/Donation_Components.md)
- [Query Strings](docs/Query_Strings.md)
- [Localization](docs/Localization.md)
- [Tests](docs/Tests.md)

## Environment Variables

You can configure the following environment variables:

|Variable|About|
|--------|-----|
| OPTIMIZELY_ID | Optimizely Project ID (not a secret) e.g. '206878104' |
| OPTIMIZELY_ACTIVE | If set to 'yes' (String) the project will include Optimizely snippet in the page load |


#### Thanks

Thanks to [BrowserStack](https://www.browserstack.com/) for providing the infrastructure that allows us to run our build in real browsers.
