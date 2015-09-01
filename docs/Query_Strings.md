# Page Query Strings

### donation amount

Specify the amount that's preselected.

Query string example: `?amount=20`

Default: nothing

Note, doesn't really do any validation right now. So negative values "work" and nonsense strings "work".

### preset donation amount

Specify the amount in the four donation amount buttons.

Query string example: `?presets=1, 2, 3, 4`

Default: 20, 10, 5, 3

Note, must be four options. It reverts to the defaults if it has more or less than 4 options.

### currency

Specify the currency. 

Query string example: `?currency=usd`

Default: usd

Available options: mxn, nok, aud, brl, cad, chf, czk, dkk, eur-de, eur-fr, gbp, hkd

Note, only works with lowercase values.
