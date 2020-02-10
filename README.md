[![Build Status](https://travis-ci.org/mozilla/donate.mozilla.org.svg?branch=master)](https://travis-ci.org/mozilla/donate.mozilla.org)

This project is now archived in favor of https://github.com/mozilla/donate-wagtail

# donate.mozilla.org

---

## Pre-requisites

[node 4+](https://nodejs.org/) with [`Intl` support](https://github.com/joyent/node/wiki/Intl).  To test if you have `Intl` support run this command:

`$ node -e "console.log(typeof Intl === 'object')"`

---

## Setup

```
$> npm install
$> cp sample.env .env
```

---

## Execution

```
$> npm start
```

With the default settings, this will run the service on http://localhost:3000

---

## Documentation

- [Deployment](docs/Deployment.md)
- [Browser Support](docs/Browser_Support.md)
- [QA Checklist](docs/QA_Checklist.md)
- [Support](docs/Support.md)
- [Metrics & A/B Testing](docs/Metrics.md)
- [Client and Server](docs/Client_Server.md)
- [Query Strings](docs/Query_Strings.md)
- [Localization](docs/Localization.md)
- [Tests](docs/Tests.md)
- [Hashing](docs/Hashing.md)

---

## Environment Variables

You can configure the following environment variables:

|Variable|About|
|--------|-----|
| SUPPORTED_LOCALES | If set to '*' all locales under `intl-config.js` file for `src` will be enabled otherwise it expects an array of locales.
| AUTO_CLOSE_DISPUTES | When set to 'true' the stripe-dispute handler will close any dispute received while processing a `charge.dispute.created` webhook event.

---

### Hatchet

Optionally configure Hatchet environment variables as documented [here](https://github.com/jbuck/hatchet) to send signup requests to a sawmill event processor queue.

---

#### Thanks

Thanks to [BrowserStack](https://www.browserstack.com/) for providing the infrastructure that allows us to run our build in real browsers.
Mozilla fundraising uses [twemoji](https://github.com/twitter/twemoji) to encourage donations

---
