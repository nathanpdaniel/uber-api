var url = "https://api.uber.com/",
    version = "v1",
    request = require("request"),
    Promise = require("promise");

/**
 *
 * Constructor, takes in your Uber API Server token and version.  Currently for most request, this is 'v1'.  
 * However, for some user history request, this is 'v1.1'.
 * This assumes if data is of type string, it is a server_token.
 * 
 * @param object required
 *  - server_token | bearer_token
 *  - version
 *
 * @throws Error if token is not supplied
 */
function Uber(data) {
  var api_version,
      server_token,
      bearer_token;
  
  if (!(this instanceof Uber)) {
    return new Uber(data);
  }
  if (typeof data === 'undefined') {
    throw new Error("Server token or data object is required.");
  }
  
  if (typeof data === 'string') {
    server_token = data;
    api_version = 'v1'; 
  } else { // assume object
    if (typeof data.server_token === 'undefined') {
      if (typeof data.bearer_token === 'undefined') {
        throw new Error("An API token is required.");
      } else {
        bearer_token = data.bearer_token;
      }
    } else {
      server_token = data.server_token;
    }
    api_version = ((typeof data.version === 'undefined')? version : data.version);
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
  function getProducts(latitude, longitude, callback) {
    if (typeof latitude === 'undefined' || typeof latitude === 'function') {
      throw new Error("Latitude must be defined");
    }
    if (typeof longitude === 'undefined' || typeof longitude === 'function') {
      throw new Error("Longitude must be defined");
    }
    
//    callback = (typeof callback === 'undefined') ? function(e,b){} : callback;
    return get(this.getAuthToken(), url+api_version+"/products?latitude="+latitude+"&longitude="+longitude, callback);
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
  function getPriceEstimate(start_latitude, start_longitude, end_latitude, end_longitude, callback) {
    var u = url + api_version + "/estimates/price?";
    u += "start_latitude="+start_latitude+"&start_longitude="+start_longitude;
    u += "&end_latitude="+end_latitude+"&end_longitude="+end_longitude;
//    callback = (typeof callback === 'undefined') ? function(e,b){} : callback;
    return get(this.getAuthToken(), u, callback);
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
  function getTimeEstimate(start_latitude, start_longitude, customer_uuid, product_id, callback) {
    if (typeof customer_uuid === 'function') {
      callback = customer_uuid;
    }
    if (typeof product_id === 'function') {
      callback = product_id;
    }
//    callback = (typeof callback === 'undefined') ? function(e,b){} : callback;
    var u = url+api_version+"/estimates/time?start_latitude="+start_latitude+"&start_longitude="+start_longitude;
    if (typeof customer_uuid !== 'undefined' && typeof customer_uuid != 'function') {
      u += "&customer_uuid="+customer_uuid;
    }
    if (typeof product_id !== 'undefined' && typeof product_id != 'function') {
      u += "&product_id="+product_id;
    }
    return get(this.getAuthToken(), u, callback);
  }
  
  /**
   *
   * getPromotions At least one valid set of coordinates is required.
   * 
   * @param Number required Start Latitude component
   * @param Number required Start Longitude component
   * @param Number required End Latitude component
   * @param Number required End Longitude component
   * @param Function A callback function which takes two parameters
   *
   */
  function getPromotions(start_latitude, start_longitude, end_latitude, end_longitude, callback) {
//    callback = (typeof callback === 'undefined') ? function(e,b){} : callback;
    var u = url+api_version+"/promotions?start_latitude="+start_latitude+"&start_longitude="+start_longitude;
    u += "&end_latitude="+end_latitude+"&end_longitude="+end_longitude;
    return get(this.getAuthToken(), u, callback);
  }
  
  /**
   * getHistory Get the currently logged in user history
   *
   * @param Function A callback function which takes two paramenters
   */
  function getHistory(callback) {
    if (typeof callback === 'undefined') {
    } else {
      var u = url+((api_version == "v1") ? "v1.1" : api_version)+"/history",
          tokenData = this.getAuthToken();
      if (tokenData.type != "bearer") {
        throw new Error("Invalid token type. Must use a token of type bearer.");
      }
      return get(tokenData, u, callback);
    }
  }
  
  /**
   * getMe Get the currently logged in user profile.
   *
   * @param Function A callback function which takes two parameters
   */
  function getMe(callback) {
    if (typeof callback === 'undefined') {
    } else {
      var u = url+api_version+"/me",
          tokenData = this.getAuthToken();
      if (tokenData.type != "bearer") {
        throw new Error("Invalid token type. Must use a token of type bearer.");
      }
      return get(tokenData, u, callback);
    }
  }
  
  
  /**
   *
   */
  function getAuthToken() {
    var data = {
      token: server_token,
      type: "server"
    };
    if (typeof bearer_token !== 'undefined') {
      data.token = bearer_token;
      data.type = "bearer";
    }
    return data;
  }
  
  return {
    getProducts: getProducts,
    getPriceEstimate: getPriceEstimate,
    getTimeEstimate: getTimeEstimate,
    getPromotions: getPromotions,
    getHistory: getHistory,
    getMe: getMe,
    getAuthToken: getAuthToken,
    api_version: api_version,
    server_token: server_token,
    bearer_token: bearer_token
  }
}

//Uber.prototype.getUserActivity = null;
//Uber.prototype.getUserProfile = null;

module.exports = Uber;

/**
 * @private
 * A function to help ease development. So as not to rewrite the same thing over and over again.
 */
function get(tokenData, url, callback) {
  var tokenStr = "Token ";
  
  if (tokenData.type == "bearer") {
    tokenStr = "Bearer ";
  }
  
  var opts = {
    url: url,
    headers: {
      "Authorization": tokenStr + tokenData.token
    }
  }
  
  return new Promise(function(fulfill, reject){
    request.get(opts, function(error, body, response) {
      if (error) {
        reject(JSON.parse(error));
        if (typeof callback !== 'undefined')
          callback(JSON.parse(error), null);
      } else {
        if (body.statusCode != 200) {
          reject(JSON.parse(response));
          if (typeof callback !== 'undefined')
            callback(JSON.parse(response), null);
        } else {
          var res = JSON.parse(response);

          // Examine rate limit headers
          var rateLimit = body.headers["x-rate-limit-limit"];
          var rateRemaining = body.headers["x-rate-limit-remaining"];
          var rateReset = body.headers["x-rate-limit-reset"];
          if(typeof rateLimit !== 'undefined'
            && typeof rateRemaining !== 'undefined'
            && typeof rateReset !== 'undefined'){
            // Add rate limit to response object
            res.rate_limit = {
              "limit" : rateLimit,
              "remaining" : rateRemaining,
              "reset" : new Date(rateReset * 1000)
            };
          }

          fulfill(res);
          if (typeof callback !== 'undefined')
            callback(null, res);
        }
      }
    });
  });
}