var url = "https://api.uber.com/",
    version = "v1",
    request = require("request");

/**
 *
 * Constructor, takes in your Uber API Server token and version.  Currently for most request, this is 'v1'.  
 * However, for some user history request, this is 'v1.1'.
 * 
 * @param string required The Uber API server token
 * @param string  The current version to use for request calls
 *
 * @throws Error if token is not supplied
 */
function Uber(token, version) {
  if (typeof token === 'undefined') {
    throw new Error("Server token is required.");
  }
  this.token = token;
  this.version = (typeof version === 'undefined') ? 'v1' : version;
}

/**
 *
 * getProducts
 *
 * @param Number required Latitude component of location.
 * @param Number required Longitude component of location.
 * @param Function A callback function which takes two parameters
 *
 * @throws Error If the latitude or longitude are not supplied
 */
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

/**
 *
 * getPriceEstimate Requires both a starting and ending point
 *
 * @param Number required Latitude component of start location.
 * @param Number required Longitude component of start location.
 * @param Number required Latitude component of end location.
 * @param Number required Longitude component of end location.
 * @param Function A callback function which takes two parameters
 *
 * @throws Error If the starting or ending latitude or longitude are not supplied
 */
Uber.prototype.getPriceEstimate = function (start_lat, start_lon, end_lat, end_lon, callback) {
  callback = (typeof callback === 'undefined') ? function(e,b){} : callback;
  get(this.token, url+this.version+"/estimates/price?start_latitude="+start_lat+"&start_longitude="+start_lon+"&end_latitude="+end_lat+"&end_longitude="+end_lon, callback);
}

/**
 *
 * getTimeEstimate Requires starting point, gives an estimate (in seconds) of time until arrival
 *
 * @param Number required Latitude component.
 * @param Number required Longitude component.
 * @param String Unique customer identifier to be used for experience customization.
 * @param String Unique identifier representing a specific product for a given latitude & longitude.
 * @param Function A callback function which takes two parameters
 *
 * @throws Error If the starting or ending latitude or longitude are not supplied
 */
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

/**
 * @private
 * A function to help ease development. So as not to rewrite the same thing over and over again.
 */
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