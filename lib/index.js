var url = "https://api.uber.com/",
    version = "v1",
    request = require("request");

function Uber(token, version) {
  if (typeof token === 'undefined') {
    throw new Error("Server token is required.");
  }
  this.token = token;
  this.version = (typeof version === 'undefined') ? 'v1' : version;
}

Uber.prototype.getProducts = function(lat, lon, callback) {
  if (typeof lat === 'undefined' || typeof lat === 'function') {
    throw new Error("Latitude must be defined");
  }
  if (typeof lon === 'undefined' || typeof lon === 'function') {
    throw new Error("Longitude must be defined");
  }
  
  callback = (typeof callback === 'undefined') ? function(e,b){} : callback;
  
  get(this.token, url+this.version+"/products?latitude="+lat+"&longitude="+lon, callback);
}

Uber.prototype.getPriceEstimate = function (start_lat, start_lon, end_lat, end_lon, callback) {
  callback = (typeof callback === 'undefined') ? function(e,b){} : callback;
  get(this.token, url+this.version+"/estimates/price?start_latitude="+start_lat+"&start_longitude="+start_lon+"&end_latitude="+end_lat+"&end_longitude="+end_lon, callback);
}

Uber.prototype.getTimeEstimate = function (start_lat, start_lon, customer_uuid, product_id, callback) {
  if (typeof customer_uuid === 'function') {
    callback = customer_uuid;
  }
  if (typeof product_id === 'function') {
    callback = product_id;
  }
  callback = (typeof callback === 'undefined') ? function(e,b){} : callback;
  var url = url+this.version+"/estimates/time?start_latitude="+start_lat+"&start_longitude="+start_lon;
  if (typeof customer_uuid !== 'undefined' && typeof customer_uuid != 'function') {
  }
  get(this.token, ;
}

//Uber.prototype.getUserActivity = null;
//Uber.prototype.getUserProfile = null;

module.exports = Uber;


function get(token, url, callback) {
  var opts = {
    url: url,
    headers: {
      "Authorization": "Token " + token
    }
  }
  request.get(opts, function(error, body, response) {
    if (body.statusCode != 200) {
      callback(JSON.parse(response), null);
    } else {
      callback(null, JSON.parse(response));
    }
  });
}