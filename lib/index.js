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
  
  if (!(this instanceof Uber)) {
    return new Uber(token, version);
  }
  if (typeof token === 'undefined') {
    throw new Error("Server token is required.");
  }
  this.setServerToken(token);
  this.setApiVersion((typeof version === 'undefined') ? 'v1' : version);
}

Uber.prototype = {
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
  getProducts: function(latitude, longitude, callback) {
    if (typeof latitude === 'undefined' || typeof latitude === 'function') {
      throw new Error("Latitude must be defined");
    }
    if (typeof longitude === 'undefined' || typeof longitude === 'function') {
      throw new Error("Longitude must be defined");
    }

    callback = (typeof callback === 'undefined') ? function(e,b){} : callback;
    
    get(this.getServerToken(), url+this.version+"/products?latitude="+latitude+"&longitude="+longitude, callback);
  },
  
  
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
  getPriceEstimate: function (start_latitude, start_longitude, end_latitude, end_longitude, callback) {
    var u = url + this.version + "/estimates/price?";
    u += "start_latitude="+start_latitude+"&start_longitude="+start_longitude;
    u += "&end_latitude="+end_latitude+"&end_longitude="+end_longitude;
    callback = (typeof callback === 'undefined') ? function(e,b){} : callback;
    get(this.getServerToken(), u, callback);
  },
  
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
  getTimeEstimate: function (start_latitude, start_longitude, customer_uuid, product_id, callback) {
    if (typeof customer_uuid === 'function') {
      callback = customer_uuid;
    }
    if (typeof product_id === 'function') {
      callback = product_id;
    }
    callback = (typeof callback === 'undefined') ? function(e,b){} : callback;
    var u = url+this.version+"/estimates/time?start_latitude="+start_latitude+"&start_longitude="+start_longitude;
    if (typeof customer_uuid !== 'undefined' && typeof customer_uuid != 'function') {
      url += "&customer_uuid="+customer_uuid;
    }
    if (typeof product_id !== 'undefined' && typeof product_id != 'function') {
      url += "&product_id="+product_id;
    }
    get(this.getServerToken(), u, callback);
  },
  
  
  setServerToken: function(token) {
    this.token = token;
  },
  getServerToken: function() {
    return this.token;
  },
  setApiVersion: function(version) {
    this.version = version;
  }
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
    if (error) {
      callback(error, null);
    } else {
      if (body.statusCode != 200) {
        callback(JSON.parse(response), null);
      } else {
        callback(null, JSON.parse(response));
      }
    }
  });
}