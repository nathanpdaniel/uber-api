uber-api
====

NodeJS implementation of Uber API

## Installation
```
npm install uber-api
```

## Usage
```javascript
var Uber = require('uber-api')('YOUR SERVER TOKEN','v1'),
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

## API Reference
```
getProducts(latitude, longitude, callback)
getPriceEstimate(start_latitude, start_longitude, end_latitude, end_longitude, callback)
getTimeEstimate(start_latitude, start_longitude, [customer_uuid], [product_id], callback)
```


