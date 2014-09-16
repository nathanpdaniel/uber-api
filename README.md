uber
====

NodeJS implementation of Uber API

Example
```javascript
var uberLib = require('../uber.js'),
    token = 'YOUR SERVER TOKEN',
    Uber = new uberLib(token,'v1'),
    lat = 36,
    lon = -94;

Uber.getProducts(lat, lon, function(error, response) {
  if (error) {
    console.log(error);
  } else {
    console.log(response);
  }
});
```

