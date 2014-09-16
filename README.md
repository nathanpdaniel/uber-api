uber
====

NodeJS implementation of Uber API

## Installation
```
npm install uber-api
```

## Usage
```javascript
var uberLib = require('uber-api'),
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

