# Localization

In this project we're using [React-Intl](https://github.com/yahoo/react-intl) to localize our application.

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
Because we are using .properties for our translation and React-Intl expects JSON, we need an extra build step to convert .properties to JSON.
We are using [properties2json](../scripts/properties2json.js) to convert from .properties to JSON.

##### config for localization

`intl-config.js`
``` json
{
  "supportedLocales": ["en-US", "de", "fr", "pt-BR", "es"],
  "dest": "locales",
  "src": "locales"
}
```
Note: You can set `supportedLocales` to '*' in your `.env` to enable all locales under `src` directory.
See the main README for more details.

##### .properties template

`locales/en-US/messages.properties`
``` properties
first=This is your first message
second=This is your second message
```

You have to make sure you match your language code in the directory structure with what you include in your config file for the converting part otherwise it will fail.

### I18N Methods

`i18n.js` file exposes different methods to help with localization. These are the list of available methods when you required the module.

``` js
{
  intlData: [Object],
  defaultLang: [String],
  currentLanguage: [String],
  isSupportedLanguage: [function],
  intlDataFor: [function],
  urlOverrideLang: [function]
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

6. `urlOverrideLang`
  This method expects a path to match a language code and will return an object with the following properties:
  ```
  {
    test: [boolean]
    pathname: [String],
    lang: [String]
  }
  ```
  If there is a valid language code in the path `test` will return `true` and you can inspect the language code from `lang` property.

### Translation

We use Pontoon to do all of our translation, so if you would like to help us translate please visit [this link](https://pontoon.mozilla.org/zh-cn/fundraising/Mozilla%20Assets/).
NOTE: You have to be logged in with Persona before you can access the link above.
