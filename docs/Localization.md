# Localization

In this project we're using [React-Intl](https://github.com/yahoo/react-intl) to localize our application.

#### Localize a component or page

To localize a component or page you have to include `contextTypes` for `intl` when you create class, for example:

``` typescript
var React = require('react');

var Example = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  render: function() {
    return (
      <div>
        <h1>{this.context.intl.formatMessage({id: 'key_name_here'})}
      </div>
    );
  }

});
```

If the strings include HTML, use the `FormattedHTMLMessage` element:

``` typescript
import { FormattedHTMLMessage } from 'react-intl';

<FormattedHTMLMessage id="key_name_here" />
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

### Translation

We use Pontoon to do all of our translation, so if you would like to help us translate please visit [this link](https://pontoon.mozilla.org/zh-cn/fundraising/Mozilla%20Assets/).
NOTE: You have to be logged in with Persona before you can access the link above.
